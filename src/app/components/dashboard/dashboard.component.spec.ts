import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule.withRoutes([])],
      providers: [AuthService]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open signout dialog when requestSignOut is called', () => {
    expect(component.isSignoutDialogOpen).toBeFalse();

    component.requestSignOut();

    expect(component.isSignoutDialogOpen).toBeTrue();
  });

  it('should close signout dialog without logging out on closeSignoutDialog', () => {
    component.isSignoutDialogOpen = true;

    component.closeSignoutDialog();

    expect(component.isSignoutDialogOpen).toBeFalse();
    expect(authService.isLoggedIn).toBeFalse();
  });

  it('should logout and navigate to root on confirmSignOut', fakeAsync(() => {
    spyOn(authService, 'logout').and.callThrough();
    spyOn(router, 'navigate');

    component.confirmSignOut();

    tick();

    expect(component.isSignoutDialogOpen).toBeFalse();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));
});
