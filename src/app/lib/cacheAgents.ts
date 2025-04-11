import { CacheEntry, CacheStage, ModelConfig } from '@/types/agents';

import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';

export class CacheAgent {
  private cache: Record<string, CacheEntry>;
  private ttlMs: number;

  constructor(
    private cacheFile = path.join(process.cwd(), 'ai_cache.json'),
    ttlHours = 24
  ) {
    this.ttlMs = ttlHours * 60 * 60 * 1000;
    this.cache = this.loadCacheSync();
  }

  private loadCacheSync(): Record<string, CacheEntry> {
    try {
      return JSON.parse(fs.readFileSync(this.cacheFile, 'utf-8'));
    } catch {
      return {};
    }
  }

  private isEntryValid(entry: CacheEntry): boolean {
    return Date.now() - new Date(entry.timestamp).getTime() < this.ttlMs;
  }

  getResponse(query: string, config: ModelConfig, stage: CacheStage): string | null {
    const key = this.generateKey(query, config, stage);
    const entry = this.cache[key];
    return entry && this.isEntryValid(entry) ? entry.response : null;
  }

  async storeResponse(query: string, config: ModelConfig, stage: CacheStage, response: string) {
    const key = this.generateKey(query, config, stage);
    this.cache[key] = {
      response,
      timestamp: new Date().toISOString(),
      stage,
      model: config.modelName,
      query,
      config
    };
    
    if (Object.keys(this.cache).length % 10 === 0) {
      this.cache = Object.fromEntries(
        Object.entries(this.cache).filter(([_, v]) => this.isEntryValid(v))
      );
    }
    
    fs.writeFile(this.cacheFile, JSON.stringify(this.cache, null, 2), (err) => {
      if (err) {
        console.error('Error writing cache file:', err);
      }
    });
  }

  private generateKey(query: string, config: ModelConfig, stage: CacheStage): string {
    const str = `${stage}-${query}-${config.modelName}-${config.responsePrefix}`;
    return createHash('sha256').update(str).digest('hex');
  }
}