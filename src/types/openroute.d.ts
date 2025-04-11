declare namespace OpenRouter {
    interface CompletionRequest {
      model?: string;
      messages: {
        role: 'user' | 'assistant' | 'system';
        content: string;
      }[];
      temperature?: number;
      max_tokens?: number;
    }
  
    interface CompletionResponse {
      id: string;
      choices: {
        message: {
          role: string;
          content: string;
        };
        finish_reason: string;
        index: number;
      }[];
      usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
      };
    }
    interface Model {
        id: string;
        name: string;
        description: string;
        pricing: {
          prompt: string;
          completion: string;
        };
        architecture: {
          tokenizer: string;
          instruct_type: string | null;
        };
        context_length: number;
        top_provider: {
          max_completion_tokens: number | null;
        };
        per_request_limits: {
          prompt_tokens: string;
          completion_tokens: string;
        } | null;
      }
    
      interface ModelsResponse {
        data: Model[];
      }
  }