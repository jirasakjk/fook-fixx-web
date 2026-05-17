import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmSignoutDialogComponent } from './confirm-signout-dialog.component';

describe('ConfirmSignoutDialogComponent', () => {
  let component: ConfirmSignoutDialogComponent;
  let fixture: ComponentFixture<ConfirmSignoutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmSignoutDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmSignoutDialogComponent);
    component = fixture.componentInstance;
    component.username = 'TestUser';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the username in the dialog', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('TestUser');
  });

  it('should emit cancel when cancel button is clicked', () => {
    spyOn(component.cancel, 'emit');
    const button = fixture.nativeElement.querySelector('.cancel-button') as HTMLButtonElement;
    button.click();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should emit confirm when sign out button is clicked', () => {
    spyOn(component.confirm, 'emit');
    const button = fixture.nativeElement.querySelector('.confirm-button') as HTMLButtonElement;
    button.click();
    expect(component.confirm.emit).toHaveBeenCalled();
  });
});
