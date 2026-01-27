import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from './services/user';
// Đường dẫn import đúng chuẩn Angular, ví dụ nếu file nằm ở src/app/webComponent/conversationLayout/conversation.component.ts:
import { ConversationLayoutComponent } from './webComponent/conversationLayout/conversationLayout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ConversationLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('client');
  users: any[] = [];
  loading = false;
  error = '';

  constructor(private userService: User) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        // console.log('Response:', response);
        this.users = response.metadata || [];  // Sửa từ data thành metadata
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
