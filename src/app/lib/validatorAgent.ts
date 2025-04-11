import { Message } from "@/types/agents";
import { MessageUpdateCallback, openrouter } from "./openroute";



export class ValidatorAgent {
    private readonly model = 'deepseek/deepseek-r1:free';
  
    async validateResponses(question: string, responses: string[], updateCallback: MessageUpdateCallback,){
      try {
        const prompt = this.buildPrompt(question, responses);
        console.log('Prompt:', prompt);
        await openrouter.fetchWithRetry(
          {
         
            messages: [
              {role: 'assistant', content: 'hola'},
              prompt
            ],
            model: this.model
          }, updateCallback);
       
      } catch (error) {
        console.error('Validation failed:', error);
        return this.bestFallback(responses);
      }
    }
  
    private buildPrompt(question: string, responses: string[]): Message {
      const formatted = responses
        .map((r, i) => `RESPONSE ${i+1}:\n${r.trim()}`)
        .join('\n---\n');
        
      return {
        role: 'user',
        content: `Request: "${question}"\n\nResponses:\n${formatted}\n\n`
          + 'Critically analyze these responses and provide improved response with:\n'
          + '- Technical correctness\n- Complete information\n- Clear structure\n'
          + '- Examples where needed\n\nReturn ONLY improved content.'
      };
    }
  
    private bestFallback(responses: string[]): string {
      return responses.reduce((a, b) => 
        a.split(/\s+/).length > b.split(/\s+/).length ? a : b, 
        'No valid responses available'
      );
    }
  }
  