import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent {
  isLoading = input<boolean>(false);
  size = input<SpinnerSize>('md');
  overlay = input<boolean>(true);
  showSkeleton = input<boolean>(false);
  errorMessage = input<string | null>(null);

  get spinnerSizeClasses(): string {
    switch (this.size()) {
      case 'sm':
        return 'h-4 w-4 border-2';
      case 'lg':
        return 'h-8 w-8 border-4';
      case 'md':
      default:
        return 'h-6 w-6 border-4';
    }
  }

  get containerClasses(): string {
    return this.overlay()
      ? 'absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-slate-950/70 backdrop-blur-sm'
      : 'flex min-h-24 items-center justify-center rounded-2xl';
  }
}
