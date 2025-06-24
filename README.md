# 31green-test: Care Notes App

A full-stack offline-first care notes application built with React, Redux, and FastAPI. Supports offline data entry, local storage, background sync, and robust API integration.

---

## Table of Contents
- [Overview](#overview)
- [Frontend Architecture](#frontend-architecture)
  - [Data Layer](#data-layer)
  - [API Layer](#api-layer)
  - [Redux Store](#redux-store)
  - [Polling Mechanism](#polling-mechanism)
- [Backend Architecture](#backend-architecture)
- [Installation & Running Guide](#installation--running-guide)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [How It Works](#how-it-works)

---

## Overview
This project is a care notes management system that works both online and offline. Users can add, view, and sync care notes. When offline, notes are stored locally and automatically synced to the backend when the connection is restored.

---

## Frontend Architecture

### Data Layer
- **File:** `frontend/src/data/dataLayer.js`
- **Purpose:** Handles all data persistence, offline storage, and sync logic.
- **Features:**
  - Stores care notes in `localStorage` for offline access.
  - Maintains a sync queue for notes created while offline.
  - Syncs queued notes to the backend when online.
  - Polls the backend every 60 seconds to fetch the latest notes and update local storage.
  - Exposes methods for adding notes, syncing, and polling.
- **Usage:**
  - Used by Redux thunks to fetch and add notes.
  - Polling is started in `main.jsx` and stopped in `App.jsx` cleanup.

### API Layer
- **File:** `frontend/src/api/careNotesApi.js`
- **Purpose:** Provides functions to interact with the FastAPI backend.
- **Features:**
  - `fetchCareNotes()`: GET all notes from `/care-notes`.
  - `createCareNote(noteData)`: POST a new note to `/care-notes`.
  - Handles errors and returns parsed JSON.
- **Usage:**
  - Used by the data layer for all network requests.

### Redux Store
- **File:** `frontend/src/store/careNotesSlice.js` (or similar)
- **Purpose:** Central state management for care notes, sync status, and errors.
- **Features:**
  - Async thunks for fetching and adding notes via the data layer.
  - Tracks loading, error, offline status, last sync time, and sync queue length.
  - Reducers for updating state and handling sync events.
- **Usage:**
  - Used by all React components via `useSelector` and `useDispatch`.

### Polling Mechanism
- **Where:**
  - **Started:** In `frontend/src/main.jsx` via `dataLayer.startPolling(60000)` (every 60 seconds).
  - **Stopped:** In `App.jsx` cleanup (`useEffect` return function).
- **What it does:**
  - Every 60 seconds, fetches the latest notes from the backend and updates local storage.
  - Attempts to sync any notes in the offline queue.
  - Keeps the Redux store and UI in sync with the latest data.

---

## Backend Architecture
- **File:** `backend/main.py`
- **Framework:** FastAPI
- **Data Storage:** In-memory Python dictionary (`care_notes`)
- **Endpoints:**
  - `GET /care-notes`: Returns all care notes as a list.
  - `POST /care-notes`: Accepts a new note and adds it to the in-memory store. Generates a unique ID and timestamp.
  - `GET /`: Health check endpoint.
- **CORS:** Enabled for all origins for development.
- **Persistence:** Data is not persisted across server restarts (for demo/dev only).

---

## Installation & Running Guide

### Backend
1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. **Run the server:**
   ```bash
   python main.py
   ```
   Or (recommended for dev):
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
3. **API Docs:**
   - Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Frontend
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Run the app:**
   ```bash
   npm run dev
   ```
3. **Open in browser:**
   - [http://localhost:5173](http://localhost:5173) (or as shown in terminal)

---

## How It Works

1. **App Startup:**
   - The frontend starts polling for care notes every 60 seconds (see `main.jsx`).
   - The Redux store is provided to the app via `<Provider store={store}>`.

2. **Data Fetching & Sync:**
   - On load, the app fetches notes from the backend and stores them in localStorage.
   - If offline, the app uses localStorage data and queues new notes for sync.
   - When back online, the app syncs queued notes to the backend and updates localStorage.
   - Polling ensures the app always has the latest data from the backend.

3. **Adding Notes:**
   - When a user adds a note, it is immediately stored in localStorage and added to the sync queue.
   - If online, the note is sent to the backend and the local data is updated with the real ID/timestamp.
   - If offline, the note remains in the queue until connectivity is restored.

4. **UI Feedback:**
   - The app shows online/offline status, last sync time, and pending sync count in a status bar.
   - Unsynced notes are marked with an "Offline" badge.
   - Users can manually trigger a sync with the "Sync" button.

5. **Backend:**
   - Stores all notes in an in-memory dictionary.
   - Each note has a unique ID, resident name, content, author name, and timestamp.
   - Data is lost on server restart (for demo/dev only).

---

## Project Structure (Key Files)

```
backend/
  main.py              # FastAPI backend
  requirements.txt     # Backend dependencies
frontend/
  src/
    api/
      careNotesApi.js  # API layer
    data/
      dataLayer.js     # Offline data layer
    store/
      careNotesSlice.js# Redux slice
    App.jsx            # Main app component
    main.jsx           # Entry point, starts polling
```

---

## License
MIT 