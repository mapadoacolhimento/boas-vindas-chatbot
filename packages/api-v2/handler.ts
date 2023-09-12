import {
  VectorStoreIndex,
  storageContextFromDefaults,
  SimpleDirectoryReader,
  ContextChatEngine,
} from "llamaindex";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

function decodeBase64(encodedPayload) {
  return Buffer.from(encodedPayload, "base64").toString("utf-8");
}

export const chat = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const vectorStoreCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: "vector_index/vector_store.json",
    });
    const vectorStoreRes = await s3.send(vectorStoreCommand);
    const vectorStore = await vectorStoreRes.Body.transformToString();

    const indexStoreCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: "vector_index/index_store.json",
    });
    const indexStoreRes = await s3.send(indexStoreCommand);
    const indexStore = await indexStoreRes.Body.transformToString();

    const docStoreCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: "vector_index/doc_store.json",
    });
    const docStoreRes = await s3.send(docStoreCommand);
    const docStore = await docStoreRes.Body.transformToString();

    const isProd = process.env.NODE_ENV === "production";
    const persistDir = isProd ? "/tmp" : "./tmp";

    if (!existsSync(persistDir)) {
      mkdirSync(persistDir);
    }

    writeFileSync(`${persistDir}/vector_store.json`, vectorStore);
    writeFileSync(`${persistDir}/index_store.json`, indexStore);
    writeFileSync(`${persistDir}/doc_store.json`, docStore);

    const secondStorageContext = await storageContextFromDefaults({
      persistDir,
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

    const decode = event.isBase64Encoded
      ? decodeBase64(event.body)
      : event.body;
    const data = typeof decode === "string" ? JSON.parse(decode) : decode;
    const { response } = await chatEngine.chat(data?.messages?.content);

    const result = {
      statusCode: 200,
      body: JSON.stringify(response),
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
