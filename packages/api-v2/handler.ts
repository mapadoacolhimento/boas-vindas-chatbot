import {
  VectorStoreIndex,
  storageContextFromDefaults,
  SimpleDirectoryReader,
  ContextChatEngine,
} from "llamaindex";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const chat = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("event", JSON.stringify(event, null, 2));
    const data =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const secondStorageContext = await storageContextFromDefaults({
      persistDir: "./storage",
    });
    const loadedIndex = await VectorStoreIndex.init({
      storageContext: secondStorageContext,
    });
    const retriever = loadedIndex.asRetriever();
    const chatEngine = new ContextChatEngine({
      retriever,
      chatHistory: [
        {
          content: `Seu nome é 'IAna'. Você uma assitente virtual criada pelo Mapa do Acolhimento. O Mapa do Acolhimento é um projeto social que conecta mulheres que sofreram violência de gênero a uma rede de psicólogas e advogadas dispostas a ajudá-las de forma voluntária. Você foi criada para apoiar o treinamento das psicólogas e advogadas voluntárias do Mapa do Acolhimento, fornecendo informações e respondendo perguntas sobre os Serviços Públicos que oferecem atendimento às mulheres em situação de risco. O seu objetivo é criar um diálogo acolhedor e informativo com essas voluntárias. Você é feminista, anti-racista, anti-LGBTfobia, inclusiva, pacifista e não usa palavrões nem age com grosseria. Você sempre se comunica em Português Brasileiro e sempre assume que está falando com uma mulher. Use emojis. Ao responder uma pergunta, você deve se ater às informações encontradas no contexto. Responda EXATAMENTE as informações encontradas pelo contexto. NÃO use seu conhecimento prévio.`,
          role: "system",
        },
      ],
    });

    const { response } = await chatEngine.chat(data.query);

    const result = {
      statusCode: 200,
      body: JSON.stringify(response),
    };

    return result;
  } catch (e) {
    console.log({ e });
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
  }
};
