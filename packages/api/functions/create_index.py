import os

from llama_index import download_loader
from llama_index.indices.document_summary import DocumentSummaryIndex

from .common_functions import set_open_ai_api_key, create_service_context, create_s3_client
from .constants import INDEX_ID


def read_s3_documents():
  S3Reader = download_loader("S3Reader")

  loader = S3Reader(
    bucket=os.environ["AWS_S3_BUCKET_NAME"],
    key='documents/',
    aws_access_id=os.environ["AWS_ROOT_ACCESS_KEY_ID"],
    aws_access_secret=os.environ["AWS_ROOT_SECRET_ACCESS_KEY"],
    s3_endpoint_url="https://s3.sa-east-1.amazonaws.com")

  documents = loader.load_data()

  return documents


def create_doc_summary_index(documents, service_context):
  doc_summary_index = DocumentSummaryIndex.from_documents(
    documents=documents, 
    service_context=service_context)
  return doc_summary_index

def save_index_to_s3(doc_summary_index):
  s3 = create_s3_client()
  path = os.environ["AWS_S3_BUCKET_NAME"] + '/index'
  doc_summary_index.set_index_id(INDEX_ID)
  doc_summary_index.storage_context.persist(path, fs=s3)


def create_index_from_documents():
  set_open_ai_api_key()
  service_context = create_service_context()
  
  documents = read_s3_documents()
  doc_summary_index = create_doc_summary_index(documents, service_context)
  save_index_to_s3(doc_summary_index)