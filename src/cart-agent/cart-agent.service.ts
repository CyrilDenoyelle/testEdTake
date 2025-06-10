import { Injectable, Logger } from '@nestjs/common';
import { CartFunctionsService } from './cart-functions.service';
import { AgentService } from 'src/agent/agent.service';
import { Runnable } from '@langchain/core/runnables';
import { HumanMessage } from '@langchain/core/messages';

@Injectable()
export class CartAgentService {
  private agent: Runnable;
  private readonly logger = new Logger(CartAgentService.name);

  constructor(
    private readonly cartFunctionsService: CartFunctionsService,
    private readonly agentService: AgentService,
  ) {
    this.initializeAgent();
  }

  private async initializeAgent() {
    this.agent = await this.agentService.createSimpleAgent({
      tools: this.cartFunctionsService.getTools(),
      systemMessage: "Tu es un assistant qui aide à gérer un panier d'achat.",
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
