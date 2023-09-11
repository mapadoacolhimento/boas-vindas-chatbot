import openai
import s3fs
import os

from llama_index import ServiceContext
from llama_index.llms import OpenAI

def set_open_ai_api_key():
    openai.api_key = os.environ["OPENAI_API_KEY"]

def create_service_context():
    #Change this to GPT-4 once we have access
    llm = OpenAI(temperature=0.1, model="gpt-3.5-turbo")
    service_context = ServiceContext.from_defaults(llm=llm)
    return service_context

def create_s3_client():
    s3 = s3fs.S3FileSystem(
        key=os.environ["AWS_ROOT_ACCESS_KEY_ID"],
        secret=os.environ["AWS_ROOT_SECRET_ACCESS_KEY"],
        endpoint_url="https://s3.sa-east-1.amazonaws.com",
    )
    return s3