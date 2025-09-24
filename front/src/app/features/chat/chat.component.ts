import { Component, OnInit } from '@angular/core';
import {ChatMessage} from '../../models/chat-message';
import {ChatService} from '../../services/chat.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  role: 'client' | 'agent' = 'client';
  conversationId = 'global';
  content = '';
  log: ChatMessage[] = [];
  connected = false;

  constructor(private chat: ChatService) {}

  async ngOnInit() {}

  async connect() {
    await this.chat.connect(this.conversationId);
    this.connected = true;
    this.chat.messages$.subscribe(m => this.log.push(m));
  }

  send() {
    const trimmed = this.content.trim();
    if (!trimmed) return;
    const msg: ChatMessage = {
      fromRole: this.role,
      conversationId: this.conversationId,
      content: trimmed,
    };
    this.chat.send(this.conversationId, msg);
    this.content = '';
  }

}
