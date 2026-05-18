import { HttpEvent, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, BehaviorSubject, throwError, switchMap, filter, take, catchError, of, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpInterceptorFn } from '@angular/common/http';

let isRefreshing = false;
let refreshSubject = new BehaviorSubject<string | null>(null);


function parseJwt(token: string | null): any | null {
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

function isTokenExpiringSoon(token: string | null, withinSeconds = 60): boolean {
  const data = parseJwt(token);
  if (!data || !data.exp) return false;
  const exp = data.exp * 1000;
  const now = Date.now();
  return exp - now <= withinSeconds * 1000;
}

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);
  const access = auth.getAccessToken();

  // If token is expiring soon, proactively refresh before sending the request
  if (access && isTokenExpiringSoon(access, 60)) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshSubject.next(null);
      return auth.refreshToken().pipe(
        switchMap((res: any) => {
          isRefreshing = false;
          const newToken = res?.accessToken;
          refreshSubject.next(newToken);
          const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
          return next(cloned);
        }),
        catchError((refreshErr) => {
          isRefreshing = false;
          auth.clearTokens();
          return throwError(() => refreshErr);
        })
      );
    } else {
      return refreshSubject.pipe(
        filter(t => t != null),
        take(1),
        switchMap((token) => {
          const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
          return next(cloned as any);
        })
      );
    }
  }

  // Attach token if present and not expiring
  let cloned = req;
  if (access) {
    cloned = req.clone({ setHeaders: { Authorization: `Bearer ${access}` } });
  }

  return next(cloned).pipe(
    catchError(err => {
      if (err && err.status === 401) {
        // try refresh and retry
        if (!isRefreshing) {
          isRefreshing = true;
          refreshSubject.next(null);
          return auth.refreshToken().pipe(
            switchMap((res: any) => {
              isRefreshing = false;
              const newToken = res?.accessToken;
              refreshSubject.next(newToken);
              const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
              return next(retryReq);
            }),
            catchError((refreshErr) => {
              isRefreshing = false;
              auth.clearTokens();
              return throwError(() => refreshErr);
            })
          );
        } else {
          return refreshSubject.pipe(
            filter(t => t != null),
            take(1),
            switchMap((token) => {
              const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
              return next(retryReq);
            })
          );
        }
      }
      return throwError(() => err);
    })
  );
};

export const authInterceptorProvider = [{ provide: HTTP_INTERCEPTORS, useValue: authInterceptor, multi: true }];
