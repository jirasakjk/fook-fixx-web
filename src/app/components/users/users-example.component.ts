import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-users-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-white shadow-2xl">
      <div class="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold">Global loading example</h2>
          <p class="mt-1 text-sm text-slate-400">No per-call loading flags are needed in the component.</p>
        </div>
        <button
          type="button"
          class="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
          (click)="loadUser()"
        >
          Load user
        </button>
      </div>

      <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <div *ngIf="user(); else emptyState" class="space-y-2">
          <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Loaded via service</p>
          <h3 class="text-lg font-semibold">{{ user()?.name }}</h3>
          <p class="text-sm text-slate-300">{{ user()?.email }}</p>
        </div>

        <ng-template #emptyState>
          <p class="text-sm text-slate-400">No user loaded yet.</p>
        </ng-template>
      </div>
    </section>
  `
})
export class UsersExampleComponent implements OnInit {
  private readonly usersService = inject(UsersService);

  readonly user = signal<any | null>(null);

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.usersService.getUser(1).subscribe({
      next: (response) => {
        this.user.set(response);
      },
      error: () => {
        this.user.set(null);
      }
    });
  }
}
