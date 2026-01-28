import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conversation } from '../../services/conversation';

@Component({
    selector: 'conversation-layout',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './conversationLayout.component.html',
    styleUrls: ['./conversationLayout.component.css']
})

export class ConversationLayoutComponent implements OnInit {
    protected readonly title = signal('client');
    conversations: any = {};
    loading = false;
    error = '';

    constructor(private conversationService: Conversation) {}

    ngOnInit() {
        this.loadConversations('someUserId');
    }

    // Trả về tên người gửi last message cho 1 conversation
    getLastMessageSenderName(conv: any): string {
        if (!conv || !conv.lastMessage || conv.participants.length < 3) return '';
        const sender = conv.participants.find((p: any) => p.user_id === conv.lastMessage.sender_id);
        return sender && sender.full_name ? sender.full_name + ': ' : 'Ẩn danh';
    }

    loadConversations(userId: string) {
        this.loading = true;
        this.conversationService.getConversations(userId).subscribe({
            next: (response) => {
                // console.log('Response:', response);
                this.conversations = response.metadata || {};
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