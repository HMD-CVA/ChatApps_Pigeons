import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from './services/user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
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
        console.log('Response:', response);
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
