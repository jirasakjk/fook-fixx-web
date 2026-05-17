import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [AuthService]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
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
    spyOn(router, 'navigate');
    component.form.setValue({ username: 'testuser', password: 'password123' });

    component.onSubmit();

    expect(component.form.valid).toBeTrue();
    expect(component.isSubmitting).toBeTrue();
    expect(authService.displayName).toBe('testuser');

    tick(250);

    expect(component.isSubmitting).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));
});
