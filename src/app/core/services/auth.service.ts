import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, Subject, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, UserProfile } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly accessKey = 'ff_access_token';
  private readonly refreshKey = 'ff_refresh_token';
  private refreshTimerId: any = null;
  private readonly refreshMarginSeconds = 60; // refresh when token has <= 60s left
  private refreshEventsSubject = new Subject<{ status: 'started' | 'success' | 'failed'; response?: LoginResponse; error?: any }>();
  public refreshEvents$ = this.refreshEventsSubject.asObservable();

  login(payload: LoginRequest): Observable<LoginResponse> {
    console.log('Attempting login...'+ `${environment.apiUrl}`);
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap(res => this.saveTokens(res))
    );
  }

  register(payload: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, payload);
  }

  refreshToken(refreshToken?: string): Observable<LoginResponse> {
    const token = refreshToken || this.getRefreshToken();
    if (!token) return of(null as any);
    this.refreshEventsSubject.next({ status: 'started' });
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh-token`, { refreshToken: token }).pipe(
      tap(res => {
        if (res) {
          this.saveTokens(res);
          this.refreshEventsSubject.next({ status: 'success', response: res });
        }
      }),
      catchError(err => {
        this.refreshEventsSubject.next({ status: 'failed', error: err });
        return throwError(() => err);
      })
    );
  }

  logout(): Observable<any> {
    const rt = this.getRefreshToken();
    this.clearTokens();
    if (!rt) return of(null);
    return this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken: rt });
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/users/profile`);
  }

  saveTokens(response: LoginResponse) {
    if (!response) return;
    localStorage.setItem(this.accessKey, response.accessToken);
    localStorage.setItem(this.refreshKey, response.refreshToken);
    // schedule automatic refresh based on token expiry or expiresIn
    this.clearAutoRefresh();
    const ms = this.computeMsUntilRefresh(response);
    if (ms > 0) this.scheduleAutoRefresh(ms);
  }

  clearTokens() {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    this.clearAutoRefresh();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // --- Auto refresh helpers ---
  private parseJwt(token: string | null): any | null {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(decoded)));
    } catch {
      return null;
    }
  }

  private computeMsUntilRefresh(response?: LoginResponse): number {
    // Priority: use expiresIn from response if provided, otherwise parse JWT exp
    if (response && response.expiresIn) {
      const ms = (response.expiresIn - this.refreshMarginSeconds) * 1000;
      return ms > 0 ? ms : 0;
    }
    const access = this.getAccessToken();
    if (!access) return 0;
    const payload = this.parseJwt(access);
    if (!payload || !payload.exp) return 0;
    const expMs = payload.exp * 1000;
    const refreshAt = expMs - this.refreshMarginSeconds * 1000;
    const now = Date.now();
    return refreshAt - now > 0 ? refreshAt - now : 0;
  }

  private scheduleAutoRefresh(delayMs: number) {
    // safety: cap to a maximum setTimeout value; if large, schedule at max and reschedule
    const MAX_DELAY = 2147483647; // max 32-bit signed int
    const run = () => {
      // perform refresh; if it succeeds, saveTokens will schedule next one
      this.refreshToken().subscribe({
        next: () => {},
        error: () => { this.clearTokens(); }
      });
    };

    if (delayMs <= 0) {
      run();
      return;
    }

    if (delayMs > MAX_DELAY) {
      // schedule the max chunk then reschedule remaining
      this.refreshTimerId = setTimeout(() => {
        const remaining = delayMs - MAX_DELAY;
        this.scheduleAutoRefresh(remaining);
      }, MAX_DELAY);
    } else {
      this.refreshTimerId = setTimeout(run, delayMs);
    }
  }

  private clearAutoRefresh() {
    if (this.refreshTimerId) {
      clearTimeout(this.refreshTimerId);
      this.refreshTimerId = null;
    }
  }
}
