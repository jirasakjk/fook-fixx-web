import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { SpinnerComponent } from './spinner.component';

interface UserSummary {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-spinner-example',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  template: `
    <section class="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-white shadow-2xl">
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold">Loading spinner example</h2>
          <p class="mt-1 text-sm text-slate-400">Signals + HttpClient + RxJS + Tailwind.</p>
        </div>
        <button
          type="button"
          class="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
          (click)="loadUser()"
        >
          Reload data
        </button>
      </div>

      <div class="relative min-h-48 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <app-spinner
          [isLoading]="isLoading()"
          size="md"
          [showSkeleton]="!isLoading() && !user() && !errorMessage()"
          [errorMessage]="errorMessage()"
        >
          <div *ngIf="user(); else emptyState" class="space-y-3 rounded-2xl border border-white/10 bg-slate-800/80 p-4">
            <p class="text-sm uppercase tracking-[0.3em] text-slate-400">User profile</p>
            <h3 class="text-lg font-semibold">{{ user()?.name }}</h3>
            <p class="text-sm text-slate-300">{{ user()?.email }}</p>
          </div>

          <ng-template #emptyState>
            <div class="rounded-2xl border border-dashed border-white/10 bg-slate-800/50 p-4 text-sm text-slate-400">
              No profile loaded yet.
            </div>
          </ng-template>
        </app-spinner>
      </div>
    </section>
  `
})
export class SpinnerExampleComponent implements OnInit {
  private http = inject(HttpClient);

  isLoading = signal(false);
  hasError = signal(false);
  errorMessage = signal<string | null>(null);
  user = signal<UserSummary | null>(null);

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set(null);

    this.http.get<UserSummary>('https://jsonplaceholder.typicode.com/users/1')
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: UserSummary) => {
          this.user.set(response);
        },
        error: () => {
          this.hasError.set(true);
          this.errorMessage.set('Unable to load the user profile right now.');
          this.user.set(null);
        }
      });
  }
}
