import { Injectable, Logger } from '@nestjs/common';
import { AgentService } from 'src/agent/agent.service';
import { Runnable } from '@langchain/core/runnables';
import { HumanMessage } from '@langchain/core/messages';
import { TavilySearch } from '@langchain/tavily';
import { ToolNode } from '@langchain/langgraph/prebuilt';

@Injectable()
export class SearchAgentService {
  private agent: Runnable;
  private readonly logger = new Logger(SearchAgentService.name);

  constructor(private readonly agentService: AgentService) {
    this.initializeAgent();
  }

  private async initializeAgent() {
    this.agent = await this.agentService.createSimpleAgent({
      tools: new ToolNode([new TavilySearch({ maxResults: 2 })]),
      systemMessage:
        "Tu es un assistant de recherche sur le web grace au tool TavilySearch, tu dois trouver un produit qui match la description donnée par l'utilisateur, répondre le nom du produit et l'url du site où tu l'as trouvé.",
    });
  }

  async process({
    input,
    configurable,
  }: {
    input: string;
    configurable: { thread_id?: string };
  }): Promise<string> {
    try {
      this.logger.debug("Envoi de la requête à l'agent:", input);

      const agentNextState = await this.agent.invoke(
        { messages: [new HumanMessage(input)] },
        { configurable },
      );
      const result =
        agentNextState.messages[agentNextState.messages.length - 1].content;

      return result;
    } catch (error) {
      this.logger.error(
        `Erreur lors du traitement de la requête: ${error.message}`,
      );
      return "Une erreur s'est produite lors du traitement de votre demande.";
    }
  }
}
