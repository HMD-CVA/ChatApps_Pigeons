import { Component, signal, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Home } from '../../services/home';

@Component({
    selector: 'conversation-layout',
    standalone: true,
    imports: [JsonPipe],
    templateUrl: './conversationLayout.component.html',
    styleUrls: ['./conversationLayout.component.css']
})

export class ConversationLayoutComponent implements OnInit {
    protected readonly title = signal('client');
    homes: any = {};
    loading = false;
    error = '';

    constructor(private homeService: Home) {}

    ngOnInit() {
        this.loadConversations('someUserId');
    }

    loadConversations(userId: string) {
        this.loading = true;
        this.homeService.getConversations(userId).subscribe({
            next: (response) => {
                // console.log('Response:', response);
                this.homes = response.metadata || {};
                
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