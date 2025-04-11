import { ModelConfig } from "@/types/agents";
import { ValidatorAgent } from "./validatorAgent";
import { MessageUpdateCallback, openrouter } from "./openroute";


export class Orchestrator {
    private agents: ModelAgent[];
    private validator = new ValidatorAgent();
    constructor(models: string[] = []) {
      this.agents = [
        ...models.map((model, i) => new ModelAgent({responsePrefix: `RESPONSE:${i+1}`, modelName: model})),
      ];
    }
  
    async processRequest(message: string, updateCallback: MessageUpdateCallback,) {
  
      const responses = await Promise.all(
        this.agents.map(agent => this.processAgent(agent, message))
      );
  
      await this.validator.validateResponses(message, responses, updateCallback);
     
    }
  
    private async processAgent(agent: ModelAgent, message: string): Promise<string> {
  
      const response = await agent.generateResponse(message);
      return response;
    }
  }
  
  // src/lib/modelAgent.ts
  export class ModelAgent {
    constructor(public config: ModelConfig) {}
  
    async generateResponse(message: string): Promise<string> {
      try {
        return await openrouter.getResponse({
          response: this.config.responsePrefix,
          message: [
            {role: 'assistant', content: 'hola'},
            {role: 'user', content: message}
          ],
          model: this.config.modelName
        });
      } catch (error) {
        console.error(`Model ${this.config.modelName} failed:`, error);
        return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }
  }
  