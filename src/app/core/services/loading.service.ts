import { Injectable, computed, signal } from '@angular/core';
import { HttpContext, HttpContextToken } from '@angular/common/http';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly activeRequestCount = signal(0);
  readonly isLoading = computed(() => this.activeRequestCount() > 0);

  show(): void {
    this.activeRequestCount.update((currentCount) => currentCount + 1);
  }

  hide(): void {
    this.activeRequestCount.update((currentCount) => Math.max(0, currentCount - 1));
  }

  skipLoadingContext(): HttpContext {
    return new HttpContext().set(SKIP_LOADING, true);
  }
}
