import { Injectable, Logger } from '@nestjs/common';
import { AgentService } from 'src/agent/agent.service';
import { Runnable } from '@langchain/core/runnables';
import { HumanMessage } from '@langchain/core/messages';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { tool } from '@langchain/core/tools';
import { SearchAgentService } from 'src/search-agent/search-agent.service';
import { CartAgentService } from 'src/cart-agent/cart-agent.service';

@Injectable()
export class CoordinatorAgentService {
  private agent: Runnable;
  private readonly logger = new Logger(CoordinatorAgentService.name);

  constructor(
    private readonly agentService: AgentService,
    private readonly searchAgentService: SearchAgentService,
    private readonly cartAgentService: CartAgentService,
  ) {
    this.initializeAgent();
  }

  private async initializeAgent() {
    this.agent = await this.agentService.createSimpleAgent({
      tools: new ToolNode([
        tool(
          async (input: string) => {
            return await this.searchAgentService.process({
              input,
              configurable: { thread_id: '42' },
            });
          },
          {
            name: 'searchProduct',
            description: 'Agent de recherche de produits sur le web',
          },
        ),
        tool(
          async (input: string) => {
            return await this.cartAgentService.process({
              input,
              configurable: { thread_id: '42' },
            });
          },
          {
            name: 'manageCart',
            description:
              'Agent de gestion des produits dans le panier (ajout, suppression, affichage)',
          },
        ),
      ]),
      systemMessage: `Tu es un agent coordinateur qui orchestre les interactions entre les agents de recherche et de gestion de panier.
Tu dois analyser la requête de l'utilisateur et décider quelles actions effectuer :
1. Si l'utilisateur demande une recherche de produit, utilise l'outil searchProduct et propose a l'utilisateur les résultat.
2. Si l'utilisateur demande une action sur le panier (ajout, suppression, affichage), utilise l'outil manageCart pour répondre a la demande utilisateur.
3. Si les deux sont nécessaires, coordonne les actions dans le bon ordre
(par example si l'utilisateur demande d'ajouter un produit que tu n'as pas encore recherché: Demande a l'agent de recherche puis donne le résultat de la recherche a l'agent de gestion de panier pour qu'il l'ajoute au panier)

Ta réponse doit être claire et concise, en français.`,
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
      this.logger.debug("Envoi de la requête à l'agent coordinateur:", input);

      const agentNextState = await this.agent.invoke(
        { messages: [new HumanMessage(input)] },
        {
          configurable,
        },
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
