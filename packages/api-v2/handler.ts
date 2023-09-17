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
      content: `Oie, Viviane! Agora vamos avaliar o seu aprendizado. Eu vou te perguntar EXATAMENTE "Como identificar se a mulher precisa ser encaminha para a rede de serviços públicos?" e vou aguardar sua resposta. 
      
      A resposta correta seria:

      ---
      "Para identificar se a mulher precisa ser encaminhada para a rede de serviços públicos, é importante considerar os fatores de vulnerabilidade social que estão associados ao caso. Esses fatores vão além do atendimento especializado e envolvem questões como autonomia financeira, empregabilidade, sexualidade, questões geracionais, condições de moradia, saúde mental ou física, direitos sexuais e reprodutivos, entre outros.

      Para identificar esses fatores, você pode fazer algumas perguntas, como:

      1. A pessoa acolhida necessita de abrigamento urgente ou temporário?
      2. A pessoa acolhida necessita ser inserida em algum programa de transferência de renda?
      3. A pessoa acolhida necessita ser inserida em algum programa de auxílio moradia?
      4. A pessoa acolhida necessita ser inserida em um serviço de fortalecimento de vínculos?

      Essas perguntas ajudam a identificar as necessidades específicas da mulher e indicam se é necessário encaminhá-la para a rede de serviços adequada. É importante lembrar que o acompanhamento deve ser de médio a longo prazo para lidar de forma integral com essas questões."
      ---

      Depois que você responder, eu vou complementar a sua resposta, utilizando EXATAMENTE as informações corretas acima.
      `,
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
