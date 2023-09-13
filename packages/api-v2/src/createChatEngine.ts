import { writeFileSync, existsSync, mkdirSync } from "fs";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {
  ContextChatEngine,
  OpenAI,
  VectorStoreIndex,
  serviceContextFromDefaults,
  storageContextFromDefaults,
} from "llamaindex";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

export const createChatEngine = async () => {
  const loadedIndex = await loadIndex();
  const retriever = loadedIndex.asRetriever();

  const chatEngine = new ContextChatEngine({
    retriever,
    chatHistory: [
      {
        content: PROMPT,
        role: "system",
      },
    ],
  });

  return chatEngine;
};

async function loadIndex() {
  const indexFilenames = [
    "vector_store.json",
    "index_store.json",
    "doc_store.json",
  ];
  const persistDir = createPersistDir();
  indexFilenames.map((filename) => readFromS3ToLocalFS(filename, persistDir));

  const storageContext = await storageContextFromDefaults({
    persistDir,
  });
  const serviceContext = createServiceContext();

  const loadedIndex = await VectorStoreIndex.init({
    storageContext,
    serviceContext,
  });

  return loadedIndex;
}

function createPersistDir() {
  const isProd = process.env.NODE_ENV === "production";
  const persistDir = isProd ? "/tmp" : "./tmp";

  if (!existsSync(persistDir)) {
    mkdirSync(persistDir);
  }

  return persistDir;
}

async function readFromS3ToLocalFS(filename: string, persistDir: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `vector_index/${filename}`,
  });

  const res = await s3.send(command);
  const file = await res.Body.transformToString();

  writeFileSync(`${persistDir}/${filename}`, file);
}

function createServiceContext() {
  const openaiLLM = new OpenAI({ model: "gpt-3.5-turbo", temperature: 0 });
  const serviceContext = serviceContextFromDefaults({ llm: openaiLLM });
  return serviceContext;
}

const PROMPT = `Seu nome é 'IAna'. Você uma assitente virtual criada pelo Mapa do Acolhimento. O Mapa do Acolhimento é um projeto social que conecta mulheres que sofreram violência de gênero a uma rede de psicólogas e advogadas dispostas a ajudá-las de forma voluntária. Você foi criada para apoiar o treinamento das psicólogas e advogadas voluntárias do Mapa do Acolhimento, fornecendo informações e respondendo perguntas sobre os Serviços Públicos que oferecem atendimento às mulheres em situação de risco. O seu objetivo é criar um diálogo acolhedor e informativo com essas voluntárias. Você é feminista, anti-racista, anti-LGBTfobia, inclusiva, pacifista e não usa palavrões nem age com grosseria. Você sempre se comunica em Português Brasileiro e sempre assume que está falando com uma mulher. Use emojis. Ao responder uma pergunta, você deve se ater às informações encontradas no contexto. Responda EXATAMENTE as informações encontradas pelo contexto. NÃO use seu conhecimento prévio.`;
