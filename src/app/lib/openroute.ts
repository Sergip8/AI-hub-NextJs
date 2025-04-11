import { Message } from '@/types/agents';
import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const BASE_URL = process.env.OPENROUTER_URL
const MAX_RETRIES = 3;
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface CompletionOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}
export type MessageUpdateCallback = (content: string) => void;
export const openrouter = {
  
  async getModels() {
    try {
      const response = await axios.get(`${BASE_URL}/models`, {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'YOUR_SITE_URL',
          'X-Title': 'YOUR_APP_NAME',
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching models from OpenRouter:', error);
      throw error;
    }
  },


  async getResponse(data: {
    model: string;
    message: Message[];
    response: string;
  }): Promise<string> {
    const maxRetries = 3;
    let retries = 0;
  
    const requestHeaders = {
      "Authorization": "Bearer "+ OPENROUTER_API_KEY,
      "Content-Type": "application/json",
      "HTTP-Referer": "localhost",
      "X-Title": "artifact-create"
    };
  
    const requestBody = {
      model: data.model,
      messages: data.message
    };
  
    while (retries < maxRetries) {
      try {
        const res = await fetch(`${BASE_URL}/chat/completions`, {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify(requestBody)
        });
  
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
  
        const responseJson = await res.json();
  
        if ("content" in responseJson) {
          return `${data.response} ${responseJson.content}`;
        } else if ("choices" in responseJson && Array.isArray(responseJson.choices) && responseJson.choices.length > 0) {
          return `${data.response} ${responseJson.choices[0].message.content}`;
        } else {
          retries++;
          console.warn(`Empty or unexpected response. Retry attempt ${retries}/${maxRetries}`);
  
          if (retries >= maxRetries) {
            console.error("Maximum retries reached. Returning fallback response.");
            return `${data.response} None`;
          }
        }
      } catch (error: any) {
        retries++;
        console.error(`Error during API call: ${error}. Retry attempt ${retries}/${maxRetries}`);
        if (retries >= maxRetries) {
          console.error("Maximum retries reached. Returning error response.");
          return `${data.response} Error: ${error.message || error}`;
        }
      }
    }
  
    // Fallback return, just in case
    return `${data.response} Unexpected termination`;
  },
  async fetchWithRetry (
    options: CompletionOptions,
    updateCallback: MessageUpdateCallback,
    retries = MAX_RETRIES
  )  {
    let attempts = 0;
  
    while (attempts < retries) {
      try {
        const response = await fetch(`${BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: options.model,
            messages: options.messages,
            stream: true,
          }),
        });
  
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not readable');
        }
  
        const decoder = new TextDecoder();
        let buffer = '';
        let assistantMessage = '';
  
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
  
            buffer += decoder.decode(value, { stream: true });
  
            while (true) {
              const lineEnd = buffer.indexOf('\n');
              if (lineEnd === -1) break;
  
              const line = buffer.slice(0, lineEnd).trim();
              buffer = buffer.slice(lineEnd + 1);
  
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') return; // End of transmission
  
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
                    const content = parsed.choices[0].delta.content;
  
                    if (content) {
                      assistantMessage += content;
                      updateCallback(assistantMessage);
                    }
                  }
                } catch (e) {
                  console.error('Error parsing JSON:', e);
                  console.error('Trying again...');
                  break; // Exit the inner while to retry
                }
              }
            }
          }
          return; // If it gets here the request was successful
        } finally {
          reader.cancel();
        }
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error);
        attempts++;
        if (attempts >= retries) {
          throw new Error('Maximum retries reached.');
        }
        console.log('Retrying request...');
      }
    }
  }
};

