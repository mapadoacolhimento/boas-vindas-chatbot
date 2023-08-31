try:
    import unzip_requirements
except ImportError:
    pass

from flask import Flask, request, jsonify, make_response
import os
import openai
import s3fs
from dotenv import load_dotenv

from llama_index import ServiceContext, set_global_service_context, StorageContext, load_index_from_storage
from llama_index.prompts import Prompt
from llama_index.llms import OpenAI
from constants import IANA_PROMPT

load_dotenv()

app = Flask(__name__)

for name, value in os.environ.items():
    print("{0}: {1}".format(name, value))

def set_open_ai_api_key():
    openai.api_key = os.getenv("OPENAI_API_KEY")

def configure_llm():
    #Change this to GPT-4 once we have access
    llm = OpenAI(temperature=0.1, model="gpt-3.5-turbo")
    service_context = ServiceContext.from_defaults(llm=llm)
    set_global_service_context(service_context)

def load_index_from_s3():
    s3 = s3fs.S3FileSystem(
        key=os.getenv("AWS_ACCESS_KEY_ID"),
        secret=os.getenv("AWS_SECRET_ACCESS_KEY"),
        endpoint_url=os.getenv("AWS_S3_BUCKET"),
    )
    sc = StorageContext.from_defaults(
        persist_dir='boas-vindas-chatbot-context/index', fs=s3
    )
    return load_index_from_storage(sc, 'doc_summary_index')

def create_chat_engine():
    return doc_summary_index.as_chat_engine(
        system_prompt=IANA_PROMPT,
        chat_mode="openai"
    )

set_open_ai_api_key()
configure_llm()

doc_summary_index = load_index_from_s3()

chat_engine = create_chat_engine()

def send_messages(messages):
    return chat_engine.chat(messages)

@app.route("/chat", methods = ['POST'])
def fetch_res_chat():
    data = request.json
    res = send_messages(messages=data["messages"]["content"])
    return str(res), 200

@app.route("/")
def hello_from_root():
    return jsonify(message='Hello from root!')

@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error='Not found!'), 404)
