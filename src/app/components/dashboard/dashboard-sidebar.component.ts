import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DashboardMenuItem {
  label: string;
  key: string;
}

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css']
})
export class DashboardSidebarComponent {
  @Input() selected = 'dashboard';
  @Input() menuItems: DashboardMenuItem[] = [];
  @Input() isOpen = true;
  @Input() isDarkMode = true;
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() signOut = new EventEmitter<void>();
  @Output() selectMenu = new EventEmitter<string>();
}
