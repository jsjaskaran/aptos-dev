import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { Embeddings } from '@langchain/core/embeddings';
import { AIMessage, HumanMessage, SystemMessage, ToolMessage, BaseMessage } from "@langchain/core/messages";
import { StringOutputParser } from '@langchain/core/output_parsers';
import eventEmitter from 'events';
import { StreamEvent } from '@langchain/core/tracers/log_stream';
import { IterableReadableStream } from '@langchain/core/utils/stream';
import { StateGraph, MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import tools from '../tools';
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { CallbackHandler } from "langfuse-langchain";
import { getLangfuseSecretKey, getLangfusePublicKey, getLangfuseHost } from '../config';

export interface MetaSearchAgentType {
  searchAndAnswer: (
    message: string,
    history: BaseMessage[],
    llm: BaseChatModel,
    embeddings: Embeddings,
    optimizationMode: 'speed' | 'balanced' | 'quality',
    fileIds: string[],
  ) => Promise<eventEmitter>;
}

interface Config {
  searchWeb: boolean;
  rerank: boolean;
  summarizer: boolean;
  rerankThreshold: number;
  queryGeneratorPrompt: string;
  responsePrompt: string;
  activeEngines: string[];
}

type BasicChainInput = {
  chat_history: BaseMessage[];
  query: string;
};

class MetaSearchAgent implements MetaSearchAgentType {
  private config: Config;
  private strParser = new StringOutputParser();
  private model: BaseChatModel;

  constructor(config: Config) {
    this.config = config;
  }

  private queryOrRespond = async (state: typeof MessagesAnnotation.State) => {
    const response = await this.model.invoke(state.messages);
    return { messages: [response] };
  }

  private generate = async (state: typeof MessagesAnnotation.State) => {
    // Get generated ToolMessages
    let recentToolMessages: ToolMessage[] = [];
    for (let i = state["messages"].length - 1; i >= 0; i--) {
      let message = state["messages"][i];
      if (message instanceof ToolMessage) {
        recentToolMessages.push(message);
      } else {
        break;
      }
    }
    let toolMessages = recentToolMessages.reverse();
    // Format into prompt
    const docsContent = toolMessages.map((doc) => doc.content).join("\n");
    const systemMessageContent =
      "You are an assistant for question-answering tasks. " +
      "Use the following pieces of retrieved context to answer " +
      "the question. If you don't know the answer, say that you " +
      "don't know. Use three sentences maximum and keep the " +
      "answer concise." +
      "\n\n" +
      `${docsContent}`;
  
    const conversationMessages = state.messages.filter(
      (message) =>
      message instanceof HumanMessage ||
      message instanceof SystemMessage ||
      (message instanceof AIMessage && message?.tool_calls?.length == 0)
    );
    const prompt = [
      new SystemMessage(systemMessageContent),
      ...conversationMessages,
    ];
    const response = await this.model.invoke(prompt);
    return {
      messages: [response]
    };
  }

  private async handleStream(
    stream: IterableReadableStream < StreamEvent > ,
    emitter: eventEmitter,
  ) {
    for await (const event of stream) {
      if (
        event.event === 'on_chain_end' &&
        event.name === 'FinalSourceRetriever'
      ) {
        emitter.emit(
          'data',
          JSON.stringify({
            type: 'sources',
            data: event.data.output
          }),
        );
      }
      if (
        event.event === 'on_chain_stream' &&
        event.name === 'FinalResponseGenerator'
      ) {
        let d = event.data.chunk;
        if (event.data.chunk.content != undefined) {
          d = event.data.chunk.content;
        }
        emitter.emit(
          'data',
          JSON.stringify({
            type: 'response',
            data: d
          }),
        );
      }
      if (
        event.event === 'on_chain_end' &&
        event.name === 'FinalResponseGenerator'
      ) {
        emitter.emit('end');
      }

      if (event.event == 'on_llm_stream') {
        const content = event.data?.chunk?.message?.content;
        if (event.data.chunk != undefined && content != undefined && content != "") {
          emitter.emit('data', JSON.stringify({
            type: 'response',
            data: content
          }))
        }
      }

      if (event.event == "on_chat_model_end" && event.data.output.content != "") {
        emitter.emit('end');
      }

      if (event.event == "on_chat_model_stream" && event?.data?.chunk?.content != undefined && event.data.chunk.content != "") {
        emitter.emit('data', JSON.stringify({
          type: 'response',
          data: event.data.chunk.content
        }))
      }

    }
  }

  async searchAndAnswer(
    message: string,
    history: BaseMessage[],
    llm: BaseChatModel,
    embeddings: Embeddings,
    optimizationMode: 'speed' | 'balanced' | 'quality',
    fileIds: string[],
  ) {
    console.log('Running searchAndAnswer: ')
    this.model = llm.bindTools(tools) as BaseChatModel;
    const emitter = new eventEmitter();
    const toolsNode = new ToolNode(tools);
    const checkpointer = new MemorySaver();
    const graphBuilder = new StateGraph(MessagesAnnotation)
        .addNode("queryOrRespond", this.queryOrRespond)
        .addNode("tools", toolsNode)
        .addNode("generate", this.generate)
        .addEdge("__start__", "queryOrRespond")
        .addConditionalEdges("queryOrRespond", toolsCondition, {
            __end__: "__end__",
            tools: "tools"
        })
        .addEdge("tools", "generate")
        .addEdge("generate", "__end__");

    const graphWithMemory = graphBuilder.compile({ checkpointer });
    let input = {
      messages: [
        /* new HumanMessage({
          content: message,
        }), */
        ...history,
      ],
    };
    const langfuseHandler = new CallbackHandler({
      secretKey:getLangfuseSecretKey(),
      publicKey:getLangfusePublicKey(),
      baseUrl:getLangfuseHost(),
      tags: ['boilerplate']
    });
    const stream = graphWithMemory.streamEvents(input, { configurable: { thread_id: Math.floor(Math.random() * 1000000).toString() }, version: 'v2', callbacks: [langfuseHandler] });
    this.handleStream(stream, emitter);

    return emitter;
  }
}

export default MetaSearchAgent;
