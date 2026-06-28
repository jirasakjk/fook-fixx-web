import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../core/services/auth.service';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { SuccessDialogService } from '../../core/services/success-dialog.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private auth = inject(AuthService);
  private router = inject(Router);
  private successDialogService = inject(SuccessDialogService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ payload }) =>
        this.auth.login(payload).pipe(
          map(response => AuthActions.loginSuccess({ response })),
          catchError(err => of(AuthActions.loginFailure({ error: err?.message || 'Login failed' })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this.router.navigate(['/dashboard']))
    ), { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ payload }) =>
        this.auth.register(payload).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError(err => of(AuthActions.registerFailure({ error: err?.message || 'Register failed' })))
        )
      )
    )
  );

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(() => this.successDialogService.show({
        title: 'Register successfully',
        message: 'Your account has been created. You can sign in now.',
        actionLabel: 'Go to sign in',
        redirectTo: '/login'
      }))
    ), { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => this.auth.logout().pipe(
        tap(() => {
          this.auth.clearTokens();
          this.router.navigate(['/']);
        }),
        map(() => ({ type: '[Auth] Logout Complete' })),
        catchError(() => of({ type: '[Auth] Logout Complete' }))
      ))
    )
  , { dispatch: false });

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadProfile),
      switchMap(() =>
        this.auth.getProfile().pipe(
          map(profile => AuthActions.loadProfileSuccess({ profile })),
          catchError(err => of(AuthActions.loadProfileFailure({ error: err?.message || 'Profile load failed' })))
        )
      )
    )
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() =>
        this.auth.refreshToken().pipe(
          map(response => AuthActions.refreshTokenSuccess({ response })),
          catchError(err => of(AuthActions.refreshTokenFailure({ error: err?.message || 'Refresh failed' })))
        )
      )
    )
  );
}
