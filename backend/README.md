# Care Notes API

A FastAPI server for managing care notes.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `GET /` - Health check
- `GET /care-notes` - Get all care notes
- `POST /care-notes` - Create a new care note

## API Documentation

Once the server is running, visit:
- http://localhost:8000/docs - Interactive API documentation (Swagger UI)
- http://localhost:8000/redoc - Alternative API documentation (ReDoc)

## Example Usage

### Create a new care note:
```bash
curl -X POST "http://localhost:8000/care-notes" \
     -H "Content-Type: application/json" \
     -d '{
       "residentName": "Alice Johnson",
       "content": "Medication administered as scheduled.",
       "authorName": "Nurse Smith"
     }'
```

### Get all care notes:
```bash
curl "http://localhost:8000/care-notes"
``` 