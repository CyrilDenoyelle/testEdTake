import { Injectable } from '@nestjs/common';
import { Runnable } from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent, ToolNode } from '@langchain/langgraph/prebuilt';

@Injectable()
export class AgentService {
  async createSimpleAgent({
    llm,
    tools,
    systemMessage,
  }: {
    llm?: ChatOpenAI;
    tools: ToolNode;
    systemMessage: string;
  }): Promise<Runnable> {
    if (!llm) {
      llm = new ChatOpenAI({
        modelName: 'gpt-4o-mini',
        temperature: 0,
      });
    }

    const agent = createReactAgent({
      llm: llm,
      tools,
      checkpointSaver: new MemorySaver(),
      prompt: systemMessage,
    });

    return agent;
  }
}

// const toolNames = tools.map((tool) => tool.name).join(', ');
// const formattedTools = tools.map((t) => convertToOpenAITool(t));

// const prompt = ChatPromptTemplate.fromMessages([
//   [
//     'system',
//     'You are a helpful AI assistant, collaborating with other assistants.' +
//       ' Use the provided tools to progress towards answering the question.' +
//       " If you are unable to fully answer, that's OK, another assistant with different tools" +
//       ' will help where you left off. Execute what you can to make progress.' +
//       ' If you or any of the other assistants have the final answer or deliverable,' +
//       ' prefix your response with FINAL ANSWER so the team knows to stop.' +
//       ' You have access to the following tools: {tool_names}.\n{system_message}',
//   ],
//   new MessagesPlaceholder('messages'),
// ]);
// const partialPrompt = await prompt.partial({
//   system_message: systemMessage,
//   tool_names: toolNames,
// });
