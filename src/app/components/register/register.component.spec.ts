import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule]
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
    spyOn(window, 'alert');
    component.form.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();

    expect(component.isSubmitting).toBeTrue();
    expect(component.form.valid).toBeTrue();

    tick(900);

    expect(component.isSubmitting).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('Registered: testuser (test@example.com)');
  }));
});
