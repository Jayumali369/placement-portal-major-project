from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import onnxruntime as ort
import numpy as np
from transformers import AutoTokenizer
from huggingface_hub import hf_hub_download
import fitz  # PyMuPDF
import os

app = FastAPI(title="Smart Career Portal AI Service")

# Setup model parameters
MODEL_ID = "Xenova/all-MiniLM-L6-v2"
MODEL_FILE = "onnx/model.onnx"
session = None
tokenizer = None

def load_model():
    global session, tokenizer
    try:
        print("Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
        
        print("Downloading/loading ONNX model...")
        model_path = hf_hub_download(repo_id=MODEL_ID, filename=MODEL_FILE)
        session = ort.InferenceSession(model_path)
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")

@app.on_event("startup")
async def startup_event():
    load_model()

def get_embedding(text: str) -> np.ndarray:
    if not session or not tokenizer:
        raise ValueError("Model not loaded properly")
        
    inputs = tokenizer(text, padding=True, truncation=True, return_tensors="np")
    # Extract inputs for ONNX session
    ort_inputs = {
        "input_ids": inputs["input_ids"].astype(np.int64),
        "attention_mask": inputs["attention_mask"].astype(np.int64),
        "token_type_ids": inputs["token_type_ids"].astype(np.int64)
    }
    
    # Run inference
    ort_outs = session.run(None, ort_inputs)
    # Mean pooling (simplified for demonstration, typically you use attention mask for correct pooling)
    embeddings = ort_outs[0]
    sentence_embedding = np.mean(embeddings, axis=1)[0]
    
    # Normalize
    norm = np.linalg.norm(sentence_embedding)
    if norm > 0:
        sentence_embedding = sentence_embedding / norm
        
    return sentence_embedding

def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    return float(np.dot(vec1, vec2))

class MatchRequest(BaseModel):
    resume_text: str
    job_description: str

@app.get("/api/health")
def health_check():
    return {
        "status": "ok", 
        "message": "AI microservice is running",
        "model_loaded": session is not None
    }

@app.post("/api/match")
def calculate_match(request: MatchRequest):
    try:
        resume_emb = get_embedding(request.resume_text)
        jd_emb = get_embedding(request.job_description)
        
        similarity = cosine_similarity(resume_emb, jd_emb)
        match_score = round(similarity * 100, 2)
        
        return {
            "match_score": match_score,
            "details": "Calculated using local ONNX model (all-MiniLM-L6-v2)"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        content = await file.read()
        pdf_document = fitz.open(stream=content, filetype="pdf")
        text = ""
        for page in pdf_document:
            text += page.get_text()
            
        return {"parsed_text": text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
