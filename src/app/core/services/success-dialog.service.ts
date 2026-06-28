import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SuccessDialogService {
  private readonly isOpenSignal = signal(false);
  private readonly titleSignal = signal('Success');
  private readonly messageSignal = signal('');
  private readonly actionLabelSignal = signal('Continue');
  private readonly redirectToSignal = signal<string | null>(null);

  readonly isOpen = computed(() => this.isOpenSignal());
  readonly title = computed(() => this.titleSignal());
  readonly message = computed(() => this.messageSignal());
  readonly actionLabel = computed(() => this.actionLabelSignal());
  readonly redirectTo = computed(() => this.redirectToSignal());

  show(options: { title: string; message: string; actionLabel?: string; redirectTo?: string | null }): void {
    this.titleSignal.set(options.title);
    this.messageSignal.set(options.message);
    this.actionLabelSignal.set(options.actionLabel ?? 'Continue');
    this.redirectToSignal.set(options.redirectTo ?? null);
    this.isOpenSignal.set(true);
  }

  hide(): void {
    this.isOpenSignal.set(false);
    this.titleSignal.set('Success');
    this.messageSignal.set('');
    this.actionLabelSignal.set('Continue');
    this.redirectToSignal.set(null);
  }
}
