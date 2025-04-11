export interface Message {
    role: 'user' | 'assistant';
    content: string;
  }

 export interface CompletionOptions {
    model?: string;
    messages: ChatMessage[];
    temperature?: number;
    max_tokens?: number;
  }
 export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }