import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { AgentChatComponent } from './components/agent-chat/agent-chat';

@Component({
  imports: [RouterOutlet, LoginComponent, AgentChatComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('github-agent-frontend');
}
