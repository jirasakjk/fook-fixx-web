import { createAction, props } from '@ngrx/store';
import { LoginRequest, LoginResponse, RegisterRequest, UserProfile } from '../../core/models/auth.models';

export const login = createAction('[Auth] Login', props<{ payload: LoginRequest }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ response: LoginResponse }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const register = createAction('[Auth] Register', props<{ payload: RegisterRequest }>());
export const registerSuccess = createAction('[Auth] Register Success');
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');

export const loadProfile = createAction('[Auth] Load Profile');
export const loadProfileSuccess = createAction('[Auth] Load Profile Success', props<{ profile: UserProfile }>());
export const loadProfileFailure = createAction('[Auth] Load Profile Failure', props<{ error: string }>());

export const refreshToken = createAction('[Auth] Refresh Token');
export const refreshTokenSuccess = createAction('[Auth] Refresh Token Success', props<{ response: LoginResponse }>());
export const refreshTokenFailure = createAction('[Auth] Refresh Token Failure', props<{ error: string }>());
