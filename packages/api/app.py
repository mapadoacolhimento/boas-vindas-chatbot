try:
    import unzip_requirements
except ImportError:
    pass

from flask import Flask, request, jsonify, make_response, Response
import os
import openai
import s3fs
import asyncio

from llama_index import ServiceContext, set_global_service_context, StorageContext, load_index_from_storage
from llama_index.prompts import Prompt
from llama_index.llms import OpenAI
from functions.constants import IANA_PROMPT
from functions.create_index import create_index_from_documents

app = Flask(__name__)

def set_open_ai_api_key():
    openai.api_key = os.environ["OPENAI_API_KEY"]

def configure_llm():
    #Change this to GPT-4 once we have access
    llm = OpenAI(temperature=0, model="gpt-3.5-turbo")
    service_context = ServiceContext.from_defaults(llm=llm)
    set_global_service_context(service_context)

def load_index_from_s3():
    s3 = s3fs.S3FileSystem(
        key=os.environ["AWS_ROOT_ACCESS_KEY_ID"],
        secret=os.environ["AWS_ROOT_SECRET_ACCESS_KEY"],
        endpoint_url="https://s3.sa-east-1.amazonaws.com",
    )
    dir = os.environ["AWS_S3_BUCKET_NAME"] + '/index'
    sc = StorageContext.from_defaults(
        persist_dir=dir, fs=s3
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
chat_engine.reset()

def chat_res(messages):
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        streaming_response = chat_engine.stream_chat(messages)
        if streaming_response._is_done:
            yield f'data: "[DONE]"\n\n'
        for token in streaming_response.response_gen:
            yield f'data: {token}\n\n'

    except Exception as e:
        app.logger.error(f"Error in chat_res: {e}")

@app.route("/chat", methods = ['POST'])
def fetch_res_chat():
    data = request.json

    if not data or "messages" not in data or "content" not in data["messages"]:
        return jsonify({"error": "Invalid request format"}), 400
    
    messages = data["messages"]["content"]

    # Create an SSE response with the correct Content-Type header
    response = Response(chat_res(messages=messages), mimetype='text/event-stream')
    response.headers['Cache-Control'] = 'no-cache'  # Optional: Prevent caching

    return response

@app.route("/")
def hello_from_root():
    return jsonify(message='Hello from root!')

@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error='Not found!'), 404)

@app.route("/create-index")
def create_index():
    create_index_from_documents()
    return "Index created successfully", 200
