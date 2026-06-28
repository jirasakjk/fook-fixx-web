import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SuccessDialogService } from '../../core/services/success-dialog.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="successDialogService.isOpen()"
      [class]="overlayClasses"
      (click)="closeDialog()"
    >
      <div
        [class]="dialogClasses"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-dialog-title"
        (click)="$event.stopPropagation()"
      >
        <div class="flex justify-center">
          <img src="assets/images/success_icon.svg" alt="Success icon" class="h-[180px] w-[180px]" />
        </div>

        <h2 id="success-dialog-title" [class]="titleClasses">{{ successDialogService.title() }}</h2>
        <p [class]="messageClasses">{{ successDialogService.message() }}</p>

        <button
          type="button"
          [class]="buttonClasses"
          (click)="closeDialog()"
        >
          {{ successDialogService.actionLabel() }}
        </button>
      </div>
    </div>
  `
})
export class SuccessDialogComponent {
  readonly successDialogService = inject(SuccessDialogService);
  readonly themeService = inject(ThemeService);

  private readonly router = inject(Router);
  readonly dialogVisible = signal(false);

  private readonly openEffect = effect(() => {
    if (!this.successDialogService.isOpen()) {
      this.dialogVisible.set(false);
      return;
    }

    queueMicrotask(() => this.dialogVisible.set(true));
  });

  get overlayClasses(): string {
    const base = this.themeService.isDarkMode
      ? 'fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm'
      : 'fixed inset-0 z-[10000] flex items-center justify-center bg-slate-200/70 px-4 backdrop-blur-sm';

    return `${base} transition-opacity duration-300 ${this.dialogVisible() ? 'opacity-100' : 'opacity-0'}`;
  }

  get dialogClasses(): string {
    const base = this.themeService.isDarkMode
      ? 'w-full max-w-md rounded-3xl border border-emerald-400/20 bg-slate-900/95 p-6 text-center shadow-2xl'
      : 'w-full max-w-md rounded-3xl border border-emerald-200 bg-white/95 p-6 text-center shadow-2xl';

    const animation = this.dialogVisible() ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95';
    return `${base} transition-all duration-300 ease-out ${animation}`;
  }

  get titleClasses(): string {
    return this.themeService.isDarkMode ? 'mt-4 text-xl font-semibold text-white' : 'mt-4 text-xl font-semibold text-slate-950';
  }

  get messageClasses(): string {
    return this.themeService.isDarkMode ? 'mt-3 text-sm leading-6 text-slate-300' : 'mt-3 text-sm leading-6 text-slate-700';
  }

  get buttonClasses(): string {
    return this.themeService.isDarkMode
      ? 'mt-6 inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400'
      : 'mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500';
  }

  closeDialog(): void {
    const redirectTo = this.successDialogService.redirectTo();
    this.successDialogService.hide();

    if (redirectTo) {
      this.router.navigate([redirectTo]);
    }
  }
}
