import { Injectable, OnDestroy } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChatMessage } from '../models/chat-message';

@Injectable({ providedIn: 'root' })
export class ChatService implements OnDestroy {
  private stomp?: Client;
  private sub?: any;
  private messagesSub = new Subject<ChatMessage>();
  private connected = false;

  get messages$(): Observable<ChatMessage> {
    return this.messagesSub.asObservable();
  }

  async connect(conversationId: string): Promise<void> {
    if (this.connected && this.stomp) {
      this.sub?.unsubscribe?.();
      this.sub = this.stomp.subscribe(`/topic/chat/${conversationId}`, this.onMessage);
      return;
    }

    this.stomp = new Client({
      webSocketFactory: () => new SockJS(environment.WS_URL), // <-- SockJS ici
      reconnectDelay: 3000,
      debug: () => {} // silence logs
    });

    return new Promise((resolve, reject) => {
      this.stomp!.onConnect = () => {
        this.connected = true;
        this.sub = this.stomp!.subscribe(`/topic/chat/${conversationId}`, this.onMessage);
        resolve();
      };
      this.stomp!.onStompError = (e) => reject(e);
      this.stomp!.onWebSocketClose = () => { this.connected = false; };
      this.stomp!.activate();
    });
  }

  private onMessage = (m: IMessage) => {
    const msg: ChatMessage = JSON.parse(m.body);
    this.messagesSub.next(msg);
  };

  send(conversationId: string, msg: ChatMessage): void {
    if (!this.stomp || !this.connected) return;
    this.stomp.publish({ destination: `/app/chat/${conversationId}`, body: JSON.stringify(msg) });
  }

  ngOnDestroy(): void {
    try { this.sub?.unsubscribe?.(); } catch {}
    try { this.stomp?.deactivate(); } catch {}
  }
}
