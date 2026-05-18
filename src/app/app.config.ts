import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { authInterceptor, authInterceptorProvider } from './core/interceptor/auth.interceptor';
import { authGuard } from './core/guards/auth.guard';
import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const appRoutes: Routes = [
    { 
        path: 'login', 
        component: LoginComponent 
    },
    { 
        path: 'register', 
        component: RegisterComponent 
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard] 
    },
    { 
        path: '', 
        redirectTo: '', 
        pathMatch: 'full' 
    }
];

export const APP_PROVIDERS = [
  provideHttpClient(withInterceptors([authInterceptor])),
  provideRouter(appRoutes),
  provideAnimations(),
  provideStore({ auth: authReducer }),
  provideEffects([AuthEffects])
  , ...authInterceptorProvider
];
