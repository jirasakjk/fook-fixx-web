import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorDialogService } from '../../core/services/error-dialog.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="errorDialogService.isOpen()"
      [class]="overlayClasses"
      (click)="closeDialog()"
    >
      <div
        [class]="dialogClasses"
        role="dialog"
        aria-modal="true"
        aria-labelledby="error-dialog-title"
        (click)="$event.stopPropagation()"
      >
        <div class="flex justify-center">
          <img src="assets/images/notify_icon.svg" alt="Notification icon" class="h-[200px] w-[200px]" />
        </div>

        <h2 id="error-dialog-title" [class]="titleClasses">Something went wrong</h2>
        <p [class]="messageClasses">{{ errorDialogService.message() }}</p>

        <div *ngIf="errorDialogService.status()" [class]="statusClasses">
          Status {{ errorDialogService.status() }}
        </div>

        <button
          type="button"
          [class]="buttonClasses"
          (click)="closeDialog()"
        >
          Close
        </button>
      </div>
    </div>
  `
})
export class ErrorDialogComponent {
  readonly errorDialogService = inject(ErrorDialogService);
  readonly themeService = inject(ThemeService);

  get overlayClasses(): string {
    const base = this.themeService.isDarkMode
      ? 'fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm'
      : 'fixed inset-0 z-[10000] flex items-center justify-center bg-slate-200/70 px-4 backdrop-blur-sm';

    return `${base} transition-opacity duration-300 ${this.dialogVisible() ? 'opacity-100' : 'opacity-0'}`;
  }

  readonly dialogVisible = signal(false);

  private readonly openEffect = effect(() => {
    if (!this.errorDialogService.isOpen()) {
      this.dialogVisible.set(false);
      return;
    }

    queueMicrotask(() => this.dialogVisible.set(true));
  });

  get dialogClasses(): string {
    const base = this.themeService.isDarkMode
      ? 'w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/95 p-6 text-center shadow-2xl'
      : 'w-full max-w-md rounded-3xl border border-slate-300/80 bg-white/95 p-6 text-center shadow-2xl';

    const animation = this.dialogVisible() ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95';
    return `${base} transition-all duration-300 ease-out ${animation}`;
  }

  get titleClasses(): string {
    return this.themeService.isDarkMode ? 'mt-4 text-xl font-semibold text-white' : 'mt-4 text-xl font-semibold text-slate-950';
  }

  get messageClasses(): string {
    return this.themeService.isDarkMode ? 'mt-3 text-sm leading-6 text-slate-300' : 'mt-3 text-sm leading-6 text-slate-700';
  }

  get statusClasses(): string {
    return this.themeService.isDarkMode ? 'mt-3 text-xs uppercase tracking-[0.3em] text-slate-500' : 'mt-3 text-xs uppercase tracking-[0.3em] text-slate-500';
  }

  get buttonClasses(): string {
    return this.themeService.isDarkMode
      ? 'mt-6 inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400'
      : 'mt-6 inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500';
  }

  closeDialog(): void {
    this.errorDialogService.hide();
  }
}
