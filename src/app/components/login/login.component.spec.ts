import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [provideMockStore({})]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit when form is invalid', () => {
    spyOn(router, 'navigate');
    component.onSubmit();

    expect(component.form.invalid).toBeTrue();
    expect(component.isSubmitting).toBeFalse();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should login and navigate when form is valid', fakeAsync(() => {
    component.form.setValue({ username: 'testuser', password: 'password123' });
    const store = TestBed.inject(Store) as any;
    spyOn(store, 'dispatch');

    component.onSubmit();

    expect(component.form.valid).toBeTrue();
    expect(component.isSubmitting).toBeFalse();
    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.login({ payload: { username: 'testuser', password: 'password123' } }));
  }));
});
