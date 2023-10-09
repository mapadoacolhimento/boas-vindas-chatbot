import {
  VectorStoreIndex,
  storageContextFromDefaults,
  SimpleDirectoryReader,
  ChatMessage,
} from "llamaindex";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createChatEngine } from "./src/createChatEngine";
import { QA_PROMPT, ASSESSMENT_PROMPT, FEEDBACK_PROMPT } from "./src/prompt";

function decodeBase64(encodedPayload) {
  return Buffer.from(encodedPayload, "base64").toString("utf-8");
}

let chatEngine = null;
createChatEngine().then((engine) => (chatEngine = engine));

async function chatHandler(event: APIGatewayProxyEvent, prompt: ChatMessage[]) {
  const decode = event.isBase64Encoded ? decodeBase64(event.body) : event.body;
  const data = typeof decode === "string" ? JSON.parse(decode) : decode;
  const chatHistory = [...prompt, ...data?.chatHistory];
  const { response } = await chatEngine.chat(
    data?.messages?.content,
    chatHistory
  );

  const result = {
    statusCode: 200,
    body: JSON.stringify(response),
  };

  return result;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForChatEngine(
  event: APIGatewayProxyEvent,
  prompt: ChatMessage[]
) {
  if (!chatEngine) {
    await sleep(150);
    return waitForChatEngine(event, prompt);
  } else {
    return chatHandler(event, prompt);
  }
}

export const chat = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (chatEngine) {
      const res = await chatHandler(event, QA_PROMPT);
      return res;
    } else {
      const res = await waitForChatEngine(event, QA_PROMPT);
      return res;
    }
  } catch (e) {
    console.log({ e });
    return {
      statusCode: 500,
      body: JSON.stringify("Something went wrong"),
    };
  }
};

export const assessment = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (chatEngine) {
      const res = await chatHandler(event, ASSESSMENT_PROMPT);
      return res;
    } else {
      const res = await waitForChatEngine(event, ASSESSMENT_PROMPT);
      return res;
    }
  } catch (e) {
    console.log({ e });
    return {
      statusCode: 500,
      body: JSON.stringify("Something went wrong"),
    };
  }
};

export const feedback = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (chatEngine) {
      const res = await chatHandler(event, FEEDBACK_PROMPT);
      return res;
    } else {
      const res = await waitForChatEngine(event, FEEDBACK_PROMPT);
      return res;
    }
  } catch (e) {
    console.log({ e });
    return {
      statusCode: 500,
      body: JSON.stringify("Something went wrong"),
    };
  }
};

export const content = async (): Promise<APIGatewayProxyResult> => {
  try {
    const documents = await new SimpleDirectoryReader().loadData({
      directoryPath: "./data",
    });

    const storageContext = await storageContextFromDefaults({
      persistDir: "./storage",
    });

    await VectorStoreIndex.fromDocuments(documents, {
      storageContext,
    });

    const result = {
      statusCode: 200,
      body: JSON.stringify("Successfully updated the index!"),
    };

    return result;
  } catch (e) {
    console.log({ e });
    return {
      statusCode: 500,
      body: JSON.stringify("Something went wrong"),
    };
  }
};
