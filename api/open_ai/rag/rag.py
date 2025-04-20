import os
import sys
import argparse
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from dotenv import load_dotenv
import pickle

def load_environment():
    load_dotenv()
    api_key = "OPENAIAPIKEY HERE"
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable is not set.")
        print("Please set it with: export OPENAI_API_KEY='your-api-key'")
        print("Or create a .env file with: OPENAI_API_KEY=your-api-key")
        sys.exit(1)
    return api_key

def setup_rag_pipeline(model_name="gpt-4"):
    embeddings = OpenAIEmbeddings()
    try:
        vector_store = Chroma(
            persist_directory=os.path.join(os.path.dirname(__file__), "data/chroma_db"),
            embedding_function=embeddings,
            collection_name="documents"
        )
        if vector_store._collection.count() == 0:
            raise Exception("No documents found in the knowledge base.")
    except Exception as e:
        raise Exception(f"Error loading vector store: {e}")
    
    llm = ChatOpenAI(
        model_name=model_name,
        temperature=0.2
    )
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 5}
        ),
        return_source_documents=True
    )
    return qa_chain

def format_sources(source_docs):
    sources = []
    for i, doc in enumerate(source_docs):
        source = f"Source {i+1}: {doc.metadata.get('source', 'Unknown')}"
        if 'chunk' in doc.metadata:
            source += f" (Chunk {doc.metadata['chunk']})"
        sources.append(source)
    unique_sources = []
    for source in sources:
        if source not in unique_sources:
            unique_sources.append(source)
    
    return "\n".join(unique_sources)

def query_knowledge_base(query, qa_chain):
    result = qa_chain({"query": query})
    answer = result["result"]
    source_docs = result.get("source_documents", [])
    sources = format_sources(source_docs)
    return answer, sources

def query(query_text, model_name="gpt-4", verbose=False):
    try:
        load_environment()
        if verbose:
            print(f"\nQuery: {query_text}")
            print("-"*50)
        qa_chain = setup_rag_pipeline(model_name=model_name)
        answer, sources = query_knowledge_base(query_text, qa_chain)
        if verbose:
            print("\nAnswer:")
            print(answer)
            print("\nSources:")
            print(sources)
        return answer, sources
    except Exception as e:
        error_msg = f"Error processing query: {str(e)}"
        if verbose:
            print(f"\nError: {error_msg}")
        return error_msg, ""

def main():
    parser = argparse.ArgumentParser(description="Query your document knowledge base")
    parser.add_argument("query", type=str, nargs="+", help="The query to ask")
    parser.add_argument("--verbose", "-v", action="store_true", help="Show additional information")
    parser.add_argument("--model", "-m", type=str, default="gpt-4", help="OpenAI model to use (default: gpt-4)")
    args = parser.parse_args()
    query_text = " ".join(args.query)
    print("\n" + "="*50)
    print("RAG Query System")
    print("="*50)
    answer, sources = query(query_text, model_name=args.model, verbose=args.verbose)
    
    if not args.verbose:
        print("\nAnswer:")
        print(answer)
        print("\nSources:")
        print(sources)
    
    print("\n" + "="*50)

if __name__ == "__main__":
    main()
