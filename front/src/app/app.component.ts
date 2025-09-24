import { Component, signal } from '@angular/core';
import {ChatComponent} from './features/chat/chat.component';

@Component({
  selector: 'app-root',
  imports: [ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly title = signal('front');
}
