import {
  VectorStoreIndex,
  storageContextFromDefaults,
  SimpleDirectoryReader,
  ChatMessage,
} from 'llamaindex';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { createChatEngine } from './src/createChatEngine';
import {
  QA_PROMPT,
  ASSESSMENT_PROMPT,
  FEEDBACK_PROMPT,
} from './src/prompt';
import getErrorMessage from './src/getErrorMessage';

function decodeBase64(encodedPayload: string): string {
  return Buffer.from(encodedPayload, 'base64').toString('utf-8');
}

let chatEngine: any = null;
let isInitializing = false;

async function initializeChatEngine(): Promise<void> {
  if (!chatEngine && !isInitializing) {
    isInitializing = true;
    try {
      chatEngine = await createChatEngine();
    } finally {
      isInitializing = false;
    }
  }
  
  // Wait if another initialization is in progress
  while (isInitializing) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

async function chatHandler(
  event: APIGatewayProxyEvent,
  prompt: ChatMessage[]
): Promise<APIGatewayProxyResult> {
  try {
    await initializeChatEngine();
    
    const decodedBody = event.isBase64Encoded && event.body
      ? decodeBase64(event.body)
      : event.body || '{}';
    
    const data = typeof decodedBody === 'string' 
      ? JSON.parse(decodedBody) 
      : decodedBody;
    
    const chatHistory = [...prompt, ...(data?.chatHistory || [])];
    
    const { response } = await chatEngine.chat(
      data?.messages?.content,
      chatHistory
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('[chatHandler] Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}

export const chat = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    return await chatHandler(event, QA_PROMPT);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`[chat] - [500]: ${errorMessage}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

export const assessment = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    return await chatHandler(event, ASSESSMENT_PROMPT);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`[assessment] - [500]: ${errorMessage}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

export const feedback = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    return await chatHandler(event, FEEDBACK_PROMPT);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`[feedback] - [500]: ${errorMessage}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

export const content = async (): Promise<APIGatewayProxyResult> => {
  try {
    const documents = await new SimpleDirectoryReader().loadData({
      directoryPath: './data',
    });

    const storageContext = await storageContextFromDefaults({
      persistDir: './storage',
    });

    await VectorStoreIndex.fromDocuments(documents, {
      storageContext,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully updated the index!' }),
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`[content] - [500]: ${errorMessage}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};