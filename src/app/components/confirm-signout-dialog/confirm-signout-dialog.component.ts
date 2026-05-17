import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-signout-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-signout-dialog.component.html',
  styleUrls: ['./confirm-signout-dialog.component.css']
})
export class ConfirmSignoutDialogComponent {
  @Input() username = 'User';
  @Input() isDarkMode = true;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
