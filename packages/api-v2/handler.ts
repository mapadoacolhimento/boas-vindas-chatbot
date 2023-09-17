import {
  VectorStoreIndex,
  storageContextFromDefaults,
  SimpleDirectoryReader,
  ChatMessage,
} from "llamaindex";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createChatEngine } from "./src/createChatEngine";
import { PROMPT, ASSESSMENT_PROMPT } from "./src/prompt";

function decodeBase64(encodedPayload) {
  return Buffer.from(encodedPayload, "base64").toString("utf-8");
}

let chatEngine = null;
createChatEngine().then((engine) => (chatEngine = engine));

async function chatHandler(event: APIGatewayProxyEvent, prompt: ChatMessage[]) {
  const decode = event.isBase64Encoded ? decodeBase64(event.body) : event.body;
  const data = typeof decode === "string" ? JSON.parse(decode) : decode;
  const chatHistory = [
    {
      content: `Seu nome é 'IAna'. Você uma assitente virtual criada pelo Mapa do Acolhimento. O Mapa do Acolhimento é um projeto social que conecta mulheres que sofreram violência de gênero a uma rede de psicólogas e advogadas dispostas a ajudá-las de forma voluntária. Você foi criada para apoiar o treinamento das psicólogas e advogadas voluntárias do Mapa do Acolhimento, fornecendo informações sobre os Serviços Públicos que oferecem atendimento às mulheres em situação de risco. O seu objetivo é criar um diálogo acolhedor e informativo com essas voluntárias. Você é feminista, anti-racista, anti-LGBTfobia, inclusiva, pacifista e não usa palavrões nem age com grosseria. Você sempre se comunica em Português Brasileiro e sempre assume que está falando com uma mulher. Use emojis. Você deve se ater às informações encontradas no contexto. Use EXATAMENTE as informações encontradas pelo contexto. NÃO use seu conhecimento prévio.`,
      role: "system",
    },
    {
      role: "assistant",
      content: `Oie, Viviane! Agora vamos avaliar o seu aprendizado. Eu vou te perguntar EXATAMENTE "Como identificar se a mulher precisa ser encaminha para a rede de serviços públicos?" e vou aguardar sua resposta. Quando você me responder, eu vou te explicar essa a mesma pergunta, buscando EXATAMENTE as informações do contexto. Eu vou responder EXATAMENTEA as informações encontradas no context. Eu NÃO vou usar os meus conhecimentos prévios`,
    },
    {
      role: "system",
      content: `Lembre-se de usar EXATAMENTE as informações encontradas pelo contexto. NÃO use seu conhecimento prévio.`,
    },
    ...data?.chatHistory,
  ];
  console.log({ chatHistory });
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
      const res = await chatHandler(event, PROMPT);
      return res;
    } else {
      const res = await waitForChatEngine(event, PROMPT);
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
