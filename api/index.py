from flask import Flask, request
import os
import openai
import s3fs
from dotenv import load_dotenv

from llama_index import ServiceContext, set_global_service_context, StorageContext, load_index_from_storage
from llama_index.prompts import Prompt
from llama_index.llms import OpenAI
from constants import IANA_PROMPT

app = Flask(__name__)

def set_open_ai_api_key():
    openai.api_key = os.getenv("OPENAI_API_KEY")

def configure_llm():
    #Change this to GPT-4 once we have access
    llm = OpenAI(temperature=0.1, model="gpt-3.5-turbo")
    service_context = ServiceContext.from_defaults(llm=llm)
    set_global_service_context(service_context)

def load_index_from_s3():
    s3 = s3fs.S3FileSystem(
        key=os.getenv("AWS_KEY"),
        secret=os.getenv("AWS_SECRET"),
        endpoint_url=os.getenv("AWS_ENDPOINT"),
    )
    sc = StorageContext.from_defaults(
        persist_dir='boas-vindas-chatbot/index', fs=s3
    )
    return load_index_from_storage(sc, 'doc_summary_index')

def create_chat_engine():
    return doc_summary_index.as_chat_engine(
        system_prompt=IANA_PROMPT,
        chat_mode="openai"
    )


load_dotenv()
set_open_ai_api_key()
configure_llm()

doc_summary_index = load_index_from_s3()

chat_engine = create_chat_engine()


def send_messages(messages):
    return chat_engine.chat(messages)

@app.route("/api/chat", methods = ['POST'])
def fetch_res_chat():
    data = request.json
    res = send_messages(messages=data["messages"]["content"])
    return str(res), 200