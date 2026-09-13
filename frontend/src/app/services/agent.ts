import { Injectable, signal, inject } from '@angular/core';
import { AuthService } from './auth.service';

export interface AgentStep {
  type: 'tool_call' | 'tool_result' | 'final_answer' | 'error';
  tool?: string;
  args?: any;
  result?: any;
  answer?: string;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  private auth = inject(AuthService);

  steps = signal<AgentStep[]>([]);
  finalAnswer = signal<string>('');
  isLoading = signal(false);

  async sendMessage(message: string) {
    this.steps.set([]);
    this.finalAnswer.set('');
    this.isLoading.set(true);

    try {
      const response = await fetch('http://localhost:3000/api/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.auth.token()}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          if (!part.startsWith('data: ')) continue;
          const jsonStr = part.slice(6);
          const event: any = JSON.parse(jsonStr);

          if (event.type === 'final_answer') {
            this.finalAnswer.set(event.answer || '');
          } else if (event.type === 'done') {
            this.isLoading.set(false);
          } else if (event.type === 'error') {
            this.finalAnswer.set(`Error: ${event.error}`);
            this.isLoading.set(false);
          } else {
            this.steps.update((current) => [...current, event as AgentStep]);
          }
        }
      }
    } catch (err: any) {
      this.finalAnswer.set(`Error: ${err.message}`);
      this.isLoading.set(false);
    }
  }
}
