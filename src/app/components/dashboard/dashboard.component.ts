import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { DashboardTopbarComponent } from '../dashboard-topbar/dashboard-topbar.component';
import { DashboardSidebarComponent } from '../dashboard-sidebar/dashboard-sidebar.component';
import { ConfirmSignoutDialogComponent } from '../confirm-signout-dialog/confirm-signout-dialog.component';

interface DashboardMenuItem {
  label: string;
  key: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardTopbarComponent, DashboardSidebarComponent, ConfirmSignoutDialogComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selected = 'dashboard';
  isSidebarOpen = true;
  isSignoutDialogOpen = false;
  menuItems: DashboardMenuItem[] = [
    { label: 'Dashboard', key: 'dashboard' },
    { label: 'Feature 1', key: 'feature1' },
    { label: 'Feature 2', key: 'feature2' },
    { label: 'Feature 3', key: 'feature3' },
    { label: 'Settings', key: 'settings' }
  ];

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  selectMenu(key: string) {
    this.selected = key;
  }

  requestSignOut() {
    this.isSignoutDialogOpen = true;
  }

  closeSignoutDialog() {
    this.isSignoutDialogOpen = false;
  }

  confirmSignOut() {
    this.isSignoutDialogOpen = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  openProfile() {
    this.selected = 'settings';
  }

  get currentTitle() {
    return this.menuItems.find(item => item.key === this.selected)?.label || 'Dashboard';
  }

  get currentDescription() {
    switch (this.selected) {
      case 'feature1':
        return 'Feature 1 helps you manage your most important tasks with quick access controls.';
      case 'feature2':
        return 'Feature 2 gives you insights and analytics to track progress over time.';
      case 'feature3':
        return 'Feature 3 includes advanced automation and workflow tools.';
      case 'settings':
        return 'Update your profile, notification preferences and application settings.';
      default:
        return 'Welcome to your dashboard. Select a menu item to explore the available tools.';
    }
  }
}
