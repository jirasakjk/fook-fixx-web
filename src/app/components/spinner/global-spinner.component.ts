import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../core/services/loading.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-global-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="loadingService.isLoading()"
      [class]="overlayClasses"
    >
      <div [class]="cardClasses">
        <div [class]="spinnerClasses"></div>
        <p [class]="textClasses">Loading...</p>
      </div>
    </div>
  `
})
export class GlobalSpinnerComponent {
  readonly loadingService = inject(LoadingService);
  readonly themeService = inject(ThemeService);

  get overlayClasses(): string {
    return this.themeService.isDarkMode
      ? 'fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm'
      : 'fixed inset-0 z-[9999] flex items-center justify-center bg-slate-100/80 backdrop-blur-sm';
  }

  get cardClasses(): string {
    return this.themeService.isDarkMode
      ? 'flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/90 px-6 py-5 shadow-2xl'
      : 'flex flex-col items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/90 px-6 py-5 shadow-2xl';
  }

  get spinnerClasses(): string {
    return this.themeService.isDarkMode
      ? 'h-8 w-8 animate-spin rounded-full border-4 border-sky-400 border-t-transparent'
      : 'h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent';
  }

  get textClasses(): string {
    return this.themeService.isDarkMode ? 'text-sm font-medium text-slate-200' : 'text-sm font-medium text-slate-900';
  }
}
