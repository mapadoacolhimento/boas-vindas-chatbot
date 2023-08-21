from flask import Flask, Response, request, stream_with_context
import os
import openai
import s3fs

from llama_index import ServiceContext, set_global_service_context, StorageContext, load_index_from_storage
# from llama_index.indices.document_summary import DocumentSummaryIndex
from llama_index.prompts import Prompt
from llama_index.llms import OpenAI

app = Flask(__name__)

# Configurando a API KEY do OpenAI
openai.api_key = os.environ["OPENAI_API_KEY"]

# Configurando o modelo que queremos usar (gpt-4)
llm = OpenAI(model="gpt-3.5-turbo")
service_context = ServiceContext.from_defaults(llm=llm)
set_global_service_context(service_context)

# Configurando o prompt
template = (
    "Your name is IAna, you are a 35-year-old black Brazilian woman. \n"
    "You are a volunteer at Mapa do Acolhimento (https://www.mapadoalhinho.org/), a social project that operates in the field of organized civil society, offering socio-assistance services in the area of ​​health, through psychological care, and in the area of access to justice, through legal assistance to women at risk and/or gender violence. \n"
    "You are an ethical, respectful, assertive, fun, encouraging, primarily informal woman. \n"
    "You are feminist, anti-racist, anti-LGBTphobic, inclusive, pacifist, you don't use profanity or react rudely. \n"
    "You always talk and interact with women, always adopting female pronouns when referring to the user. \n"
    "You can use emojis to make the conversation more friendly. \n"
    "We have provided context information below. \n"
    "---------------------\n"
    "{context_str}"
    "\n---------------------\n"
    "Given this information, please answer the question: {query_str}\n"
    "Always answer in Brazilian Portuguese and try to give examples.\n"
    "If you can't find an answer to the question, answer explaning that you didn't find an answer and you will try to improve your skills to answer this question in the future."
)
qa_template = Prompt(template)

s3 = s3fs.S3FileSystem(
    key=os.environ["AWS_KEY"],
    secret=os.environ["AWS_SECRET"],
    endpoint_url=os.environ["AWS_ENDPOINT"],
)

# Lendo o index do s3
sc = StorageContext.from_defaults(persist_dir='boas-vindas-chatbot/index', fs=s3)
doc_summary_index = load_index_from_storage(sc, 'doc_summary_index')

# Criando uma chat engine
chat_engine = doc_summary_index.as_chat_engine(
    text_qa_template=qa_template,
    chat_mode="condense_question",
    # streaming=True
)

def send_messages(messages):
    return chat_engine.chat(messages)


@app.route("/api/chat", methods = ['POST'])
def fetch_res_chat():
    data = request.json
    res = send_messages(messages=data["messages"]["content"])
    return str(res), 200
