import { Injectable, computed, signal } from '@angular/core';
import { HttpContext, HttpContextToken } from '@angular/common/http';

export const SKIP_ERROR_DIALOG = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {
  private readonly isOpenSignal = signal(false);
  private readonly messageSignal = signal('');
  private readonly statusSignal = signal<number | null>(null);

  readonly isOpen = computed(() => this.isOpenSignal());
  readonly message = computed(() => this.messageSignal());
  readonly status = computed(() => this.statusSignal());

  show(message: string, status: number | null = null): void {
    this.isOpenSignal.set(true);
    this.messageSignal.set(message);
    this.statusSignal.set(status);
  }

  hide(): void {
    this.isOpenSignal.set(false);
    this.messageSignal.set('');
    this.statusSignal.set(null);
  }

  skipErrorDialogContext(): HttpContext {
    return new HttpContext().set(SKIP_ERROR_DIALOG, true);
  }
}
