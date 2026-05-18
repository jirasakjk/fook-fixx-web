import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [provideMockStore({})]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when passwords do not match', () => {
    component.form.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'different'
    });

    expect(component.form.invalid).toBeTrue();
    expect(component.form.errors).toEqual({ mismatch: true });
  });

  it('should submit when form is valid', fakeAsync(() => {
    component.form.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    const store = TestBed.inject(Store) as any;
    spyOn(store, 'dispatch');

    component.onSubmit();

    expect(component.isSubmitting).toBeFalse();
    expect(component.form.valid).toBeTrue();
    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.register({ payload: { username: 'testuser', email: 'test@example.com', password: 'password123' } }));
  }));
});
