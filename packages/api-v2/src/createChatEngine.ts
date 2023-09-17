import { writeFileSync, existsSync, mkdirSync } from "fs";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {
  ContextChatEngine,
  OpenAI,
  VectorStoreIndex,
  serviceContextFromDefaults,
  storageContextFromDefaults,
} from "llamaindex";
import { PROMPT } from "./prompt";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

export const createChatEngine = async () => {
  const loadedIndex = await loadIndex();
  const retriever = loadedIndex.asRetriever();

  const chatEngine = new ContextChatEngine({
    retriever,
    // chatHistory: PROMPT,
  });

  return chatEngine;
};

async function loadIndex() {
  const indexFilenames = [
    "vector_store.json",
    "index_store.json",
    "doc_store.json",
  ];
  const persistDir = getPersistDir();
  const promises = indexFilenames.map((filename) =>
    readFromS3ToLocalFS(filename, persistDir)
  );
  await Promise.all(promises);

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

function getPersistDir() {
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
