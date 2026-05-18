import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authFeatureKey = 'auth';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, state => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    isAuthenticated: true
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(AuthActions.register, state => ({ ...state, loading: true, error: null })),
  on(AuthActions.registerSuccess, state => ({ ...state, loading: false })),
  on(AuthActions.registerFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(AuthActions.logout, state => ({ ...initialAuthState })),

  on(AuthActions.loadProfileSuccess, (state, { profile }) => ({ ...state, user: profile })),
  on(AuthActions.loadProfileFailure, (state, { error }) => ({ ...state, error })),

  on(AuthActions.refreshTokenSuccess, (state, { response }) => ({
    ...state,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    isAuthenticated: true
  })),
  on(AuthActions.refreshTokenFailure, state => ({ ...initialAuthState }))
);
