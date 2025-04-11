export type CacheStage = 'generation' | 'validation' | 'synthesis';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ModelConfig {
  responsePrefix: string;
  modelName: string;
  temperature?: number;
  maxTokens?: number;
}

export interface CacheEntry {
  response: string;
  timestamp: string;
  stage: CacheStage;
  model: string;
  query: string;
  config?: Partial<ModelConfig>;
}