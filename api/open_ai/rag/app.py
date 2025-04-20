import streamlit as st
import os
import requests
import PyPDF2
import io
import re
import hashlib
from bs4 import BeautifulSoup
import chromadb
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
import pickle

st.set_page_config(page_title="RAG Document Uploader", page_icon="📚", layout="wide")
def initialize_chroma():
    if not os.path.exists("data"):
        os.makedirs("data")
    embeddings = OpenAIEmbeddings()
    try:
        vector_store = Chroma(
            persist_directory="./data/chroma_db",
            embedding_function=embeddings,
            collection_name="documents"
        )
        st.sidebar.success("Connected to existing ChromaDB collection")
    except Exception as e:
        vector_store = Chroma.from_documents(
            documents=[],
            embedding=embeddings,
            persist_directory="./data/chroma_db",
            collection_name="documents"
        )
        st.sidebar.success("Created new ChromaDB collection")
    
    return vector_store

def process_document(content, doc_name, doc_type, vector_store):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    
    chunks = text_splitter.split_text(content)
    documents = []
    from langchain_core.documents import Document
    for i, chunk in enumerate(chunks):
        doc_id = hashlib.md5(f"{doc_name}_{i}".encode()).hexdigest()
        doc = Document(
            page_content=chunk,
            metadata={
                "source": doc_name,
                "type": doc_type,
                "chunk": i,
                "doc_id": doc_id
            }
        )
        documents.append(doc)
    vector_store.add_documents(documents)
    vector_store.persist()
    with open("./data/doc_metadata.pkl", "wb") as f:
        pickle.dump({
            "name": doc_name,
            "type": doc_type,
            "chunks": len(chunks)
        }, f)
    
    return len(chunks)

def extract_text_from_pdf(pdf_file):
    try:
        temp_pdf_path = "./temp_pdf_file.pdf"
        with open(temp_pdf_path, "wb") as f:
            f.write(pdf_file.getvalue())
        pdf_reader = PyPDF2.PdfReader(temp_pdf_path)
        total_pages = len(pdf_reader.pages)
        st.info(f"Processing PDF with {total_pages} pages...")
        
        text = ""
        for page_num in range(total_pages):
            progress_text = f"Extracting page {page_num+1}/{total_pages}..."
            st.write(progress_text)
            
            page = pdf_reader.pages[page_num]
            try:
                page_text = page.extract_text()
                if page_text:
                    text += f"\n\n--- Page {page_num+1} ---\n\n"
                    text += page_text
                else:
                    st.warning(f"Page {page_num+1} appears to be empty or contains non-extractable content.")
            except Exception as e:
                st.warning(f"Error extracting text from page {page_num+1}: {str(e)}")
        
        if len(text.strip()) < 1000:
            st.warning("Standard extraction yielded limited results. Trying pdfminer...")
            try:
                from pdfminer.high_level import extract_text as pdfminer_extract
                pdfminer_text = pdfminer_extract(temp_pdf_path)
                
                if len(pdfminer_text) > len(text):
                    text = pdfminer_text
                    st.success("Successfully extracted more content with pdfminer.")
            except Exception as e:
                st.error(f"pdfminer extraction failed: {str(e)}")
        
        if len(text.strip()) < 1000:
            st.warning("Text extraction methods yielded limited results. Trying OCR...")
            try:
                import pytesseract
                from pdf2image import convert_from_path
                images = convert_from_path(temp_pdf_path)
                ocr_text = ""
                for i, image in enumerate(images):
                    st.write(f"OCR processing page {i+1}/{len(images)}...")
                    page_text = pytesseract.image_to_string(image)
                    ocr_text += f"\n\n--- Page {i+1} ---\n\n"
                    ocr_text += page_text
                
                if len(ocr_text) > len(text):
                    text = ocr_text
                    st.success("Successfully extracted content with OCR.")
            except Exception as e:
                st.error(f"OCR extraction failed: {str(e)}")
        if os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)
            
        return text
    
    except Exception as e:
        st.error(f"Error processing PDF: {str(e)}")
        if os.path.exists("./temp_pdf_file.pdf"):
            os.remove("./temp_pdf_file.pdf")
        return ""

def extract_text_from_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        for script in soup(["script", "style"]):
            script.extract()
        
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        
        return text
    except Exception as e:
        st.error(f"Error extracting text from URL: {e}")
        return None

def get_all_documents(vector_store):
    """Get all documents from the vector store grouped by source"""
    try:
        results = vector_store._collection.get(
            include=['metadatas', 'documents']
        )
        documents = {}
        for i, metadata in enumerate(results['metadatas']):
            source = metadata.get('source', 'Unknown')
            doc_type = metadata.get('type', 'Unknown')
            chunk = metadata.get('chunk', 0)
            content = results['documents'][i]
            if source not in documents:
                documents[source] = {
                    'type': doc_type,
                    'chunks': {},
                    'total_chunks': 0
                }
            
            documents[source]['chunks'][chunk] = content
            documents[source]['total_chunks'] += 1
        return documents
    except Exception as e:
        st.error(f"Error retrieving documents: {str(e)}")
        return {}

def delete_document(vector_store, doc_name):
    """Delete a document from the vector store"""
    try:
        results = vector_store._collection.get(
            where={"source": doc_name},
            include=['ids']
        )
        
        if results['ids']:
            vector_store._collection.delete(ids=results['ids'])
            vector_store.persist()
            return len(results['ids'])
        return 0
    except Exception as e:
        st.error(f"Error deleting document: {str(e)}")
        return 0

def main():
    st.title("APIVeil Documentation Uploader")
    st.subheader("Upload documentation to your API knowledge base")
    
    vector_store = initialize_chroma()
    with st.sidebar:
        st.header("Knowledge Base Stats")
        try:
            collection_stats = vector_store._collection.count()
            st.metric("Documents in DB", collection_stats)
        except:
            st.metric("Documents in DB", 0)
        
        st.subheader("OpenAI API Key")
        api_key = st.text_input("Enter your OpenAI API Key", type="password")
        if api_key:
            os.environ["OPENAI_API_KEY"] = api_key
            st.success("API key set!")
    
    tab1, tab2, tab3, tab4 = st.tabs(["Upload PDF", "Add URL", "Direct Text Input", "View Documents"])
    with tab1:
        st.header("Upload PDF Documentation")
        uploaded_file = st.file_uploader("Choose a PDF file", type="pdf")
        
        if uploaded_file is not None:
            with st.spinner("Processing PDF..."):
                text = extract_text_from_pdf(io.BytesIO(uploaded_file.getvalue()))
                st.subheader("Preview:")
                st.text_area("Content", text[:1000] + "...", height=200)
                if st.button("Add to Knowledge Base", key="pdf_button"):
                    doc_name = uploaded_file.name
                    chunks_added = process_document(text, doc_name, "pdf", vector_store)
                    st.success(f"PDF processed and added to knowledge base! Created {chunks_added} chunks.")
    
    with tab2:
        st.header("Add Documentation from URL")
        url = st.text_input("Enter the URL of the documentation page")
        
        if url:
            if st.button("Fetch and Process", key="url_button"):
                with st.spinner("Fetching content from URL..."):
                    text = extract_text_from_url(url)
                    if text:
                        st.subheader("Preview:")
                        st.text_area("Content", text[:1000] + "...", height=200)
                        
                        if st.button("Add to Knowledge Base", key="url_content_button"):
                            chunks_added = process_document(text, url, "url", vector_store)
                            st.success(f"URL content processed and added to knowledge base! Created {chunks_added} chunks.")
    
    with tab3:
        st.header("Paste API Documentation Text")
        text_input = st.text_area("Paste your documentation here", height=300)
        doc_name = st.text_input("Document Name (for reference)")
        
        if text_input and doc_name:
            if st.button("Process Text", key="text_button"):
                with st.spinner("Processing text..."):
                    chunks_added = process_document(text_input, doc_name, "text", vector_store)
                    st.success(f"Text processed and added to knowledge base! Created {chunks_added} chunks.")
    
    with tab4:
        st.header("View Existing Documents")
        documents = get_all_documents(vector_store)
        
        if not documents:
            st.info("No documents found in the knowledge base.")
        else:
            st.success(f"Found {len(documents)} documents in the knowledge base.")
            doc_names = list(documents.keys())
            selected_doc = st.selectbox("Select a document to view", doc_names)
            
            if selected_doc:
                doc_info = documents[selected_doc]
                col1, col2 = st.columns(2)
                with col1:
                    st.subheader("Document Information")
                    st.write(f"**Name:** {selected_doc}")
                    st.write(f"**Type:** {doc_info['type']}")
                    st.write(f"**Total Chunks:** {doc_info['total_chunks']}")
                
                with col2:
                    if st.button("Delete Document", key="delete_doc"):
                        chunks_deleted = delete_document(vector_store, selected_doc)
                        st.success(f"Document '{selected_doc}' deleted. Removed {chunks_deleted} chunks.")
                        st.experimental_rerun()
                
                st.subheader("Document Content")
                view_option = st.radio("View as:", ["Full Document", "Individual Chunks"])
                
                if view_option == "Full Document":
                    full_text = ""
                    for i in range(doc_info['total_chunks']):
                        if i in doc_info['chunks']:
                            full_text += doc_info['chunks'][i] + "\n\n"
                    
                    st.text_area("Content", full_text, height=400)
                else:
                    chunk_numbers = list(doc_info['chunks'].keys())
                    selected_chunk = st.selectbox("Select chunk", chunk_numbers)
                    
                    if selected_chunk is not None:
                        st.text_area(f"Chunk {selected_chunk}", doc_info['chunks'][selected_chunk], height=300)
    
    st.markdown("---")
    st.header("How to Query Your Knowledge Base")
    st.markdown("""
    1. Upload your documentation using one of the methods above
    2. Run the `rag.py` script to query your knowledge base:
    ```
    python rag.py "Your question about the documentation"
    ```
    3. The script will retrieve relevant information from your documents and generate an answer
    """)

if __name__ == "__main__":
    main()
