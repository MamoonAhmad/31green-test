from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from datetime import datetime
import uuid

app = FastAPI(title="Care Notes API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure based on your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for care notes
care_notes: Dict[str, Dict[str, Any]] = {}

class CareNoteCreate(BaseModel):
    residentName: str
    content: str
    authorName: str

class CareNoteResponse(BaseModel):
    id: str
    residentName: str
    dateTime: str
    content: str
    authorName: str

@app.get("/")
async def root():
    return {"message": "Care Notes API is running"}

@app.get("/care-notes", response_model=List[CareNoteResponse])
async def get_care_notes():
    """
    Get all care notes
    """
    return list(care_notes.values())

@app.post("/care-notes", response_model=CareNoteResponse)
async def create_care_note(note: CareNoteCreate):
    """
    Create a new care note
    """
    note_id = str(uuid.uuid4())
    current_time = datetime.utcnow().isoformat() + "Z"
    
    new_note = {
        "id": note_id,
        "residentName": note.residentName,
        "dateTime": current_time,
        "content": note.content,
        "authorName": note.authorName
    }
    
    care_notes[note_id] = new_note
    
    return new_note

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 