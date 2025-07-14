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

function decodeBase64(encodedPayload) {
  return Buffer.from(encodedPayload, 'base64').toString('utf-8');
}

let chatEngine = null;

async function ensureChatEngine() {
  if (!chatEngine) {
    chatEngine = await createChatEngine();
  }
}

async function chatHandler(
  event: APIGatewayProxyEvent,
  prompt: ChatMessage[]
) {
  const decode = event.isBase64Encoded
    ? decodeBase64(event.body)
    : event.body;
  const data =
    typeof decode === 'string' ? JSON.parse(decode) : decode;
  const chatHistory = [...prompt, ...data?.chatHistory];
  const { response } = await chatEngine.chat(
    data?.messages?.content,
    chatHistory
  );

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
}

export const chat = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await ensureChatEngine();
    return await chatHandler(event, QA_PROMPT);
  } catch (e) {
    const error = getErrorMessage(e);
    console.error(`[chat] - [500]: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const assessment = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await ensureChatEngine();
    return await chatHandler(event, ASSESSMENT_PROMPT);
  } catch (e) {
    const error = getErrorMessage(e);
    console.error(`[assessment] - [500]: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const feedback = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await ensureChatEngine();
    return await chatHandler(event, FEEDBACK_PROMPT);
  } catch (e) {
    const error = getErrorMessage(e);
    console.error(`[feedback] - [500]: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
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
      body: JSON.stringify('Successfully updated the index!'),
    };
  } catch (e) {
    const error = getErrorMessage(e);
    console.error(`[content] - [500]: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
