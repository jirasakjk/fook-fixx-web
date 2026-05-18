import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

describe('AuthEffects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'register', 'refreshToken', 'logout', 'getProfile', 'clearTokens']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    effects = TestBed.inject(AuthEffects);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('login$ should dispatch loginSuccess on success', (done) => {
    const payload = { username: 'u', password: 'p' };
    const response = { accessToken: 'a', refreshToken: 'r' } as any;
    authService.login.and.returnValue(of(response));
    actions$ = of(AuthActions.login({ payload }));

    effects.login$.subscribe(action => {
      expect(action).toEqual(AuthActions.loginSuccess({ response }));
      done();
    });
  });

  it('loginSuccess$ should navigate to /profile', (done) => {
    const response = { accessToken: 'a', refreshToken: 'r' } as any;
    actions$ = of(AuthActions.loginSuccess({ response }));
    // subscribe so effect runs; tap inside effect will call router.navigate
    effects.loginSuccess$.subscribe(() => {});
    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/profile']);
      done();
    }, 0);
  });

  it('register$ should dispatch registerSuccess on success', (done) => {
    const payload = { username: 'u', email: 'e', password: 'p' } as any;
    authService.register.and.returnValue(of({}));
    actions$ = of(AuthActions.register({ payload }));

    effects.register$.subscribe(action => {
      expect(action).toEqual(AuthActions.registerSuccess());
      done();
    });
  });

  it('registerSuccess$ should navigate to /login', (done) => {
    actions$ = of(AuthActions.registerSuccess());
    effects.registerSuccess$.subscribe(() => {});
    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    }, 0);
  });

  it('refreshToken$ should dispatch refreshTokenSuccess on success', (done) => {
    const response = { accessToken: 'a2', refreshToken: 'r2' } as any;
    authService.refreshToken.and.returnValue(of(response));
    actions$ = of(AuthActions.refreshToken());

    effects.refreshToken$.subscribe(action => {
      expect(action).toEqual(AuthActions.refreshTokenSuccess({ response }));
      done();
    });
  });

  it('loadProfile$ should dispatch loadProfileSuccess on success', (done) => {
    const profile = { uuid: '1', username: 'u', email: 'e', role: 'user' } as any;
    authService.getProfile.and.returnValue(of(profile));
    actions$ = of(AuthActions.loadProfile());

    effects.loadProfile$.subscribe(action => {
      expect(action).toEqual(AuthActions.loadProfileSuccess({ profile }));
      done();
    });
  });

  it('logout$ should call logout and navigate', (done) => {
    authService.logout.and.returnValue(of(null));
    actions$ = of(AuthActions.logout());

    effects.logout$.subscribe(() => {});
    setTimeout(() => {
      expect(authService.logout).toHaveBeenCalled();
      expect(authService.clearTokens).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    }, 0);
  });
});
