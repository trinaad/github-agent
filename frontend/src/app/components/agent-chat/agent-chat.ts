import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../services/agent';
import { marked } from 'marked';

@Component({
  selector: 'app-agent-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-chat.html',
  styleUrl: './agent-chat.scss',
})
export class AgentChatComponent {
  agent = inject(AgentService);
  userInput = signal('');

  renderedAnswer = computed(() => {
    const raw = this.agent.finalAnswer();
    return raw ? (marked.parse(raw) as string) : '';
  });

  onSubmit() {
    const message = this.userInput().trim();
    if (!message || this.agent.isLoading()) return;
    this.agent.sendMessage(message);
    this.userInput.set('');
  }
}
