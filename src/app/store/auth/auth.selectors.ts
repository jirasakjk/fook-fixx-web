import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';
import { authFeatureKey } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

export const selectIsAuthenticated = createSelector(selectAuthState, s => s.isAuthenticated);
export const selectAuthLoading = createSelector(selectAuthState, s => s.loading);
export const selectAuthUser = createSelector(selectAuthState, s => s.user);
export const selectAccessToken = createSelector(selectAuthState, s => s.accessToken);
