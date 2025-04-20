from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from rag import query

app = FastAPI(title="RAG Query API")

class QueryRequest(BaseModel):
    query: str
    model_name: Optional[str] = "gpt-4"
    verbose: Optional[bool] = False

class QueryResponse(BaseModel):
    answer: str
    sources: str

@app.post("/query", response_model=QueryResponse)
async def query_endpoint(request: QueryRequest):
    try:
        answer, sources = query(
            query_text=request.query,
            model_name=request.model_name,
            verbose=request.verbose
        )
        
        return QueryResponse(
            answer=answer,
            sources=sources
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 