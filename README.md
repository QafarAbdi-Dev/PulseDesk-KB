# PulseDesk-KB

A Healthcare Knowledge Base & Embedded HMIS Chatbot System — capstone project.

## Tech Stack
- Frontend: React + Tailwind CSS (Vite)
- Backend: FastAPI (Python)
- Database: PostgreSQL

## Running the Backend

cd backend
venv\Scripts\activate
uvicorn main:app --reload

Backend runs at http://127.0.0.1:8000 (API docs at /docs).

## Running the Frontend

cd frontend
npm run dev

Frontend runs at http://localhost:5173

## First-Time Setup

1. Create the PostgreSQL database: psql -U postgres -c "CREATE DATABASE pulsedesk_db;"
2. Copy .env.example to .env in backend/ and set your DATABASE_URL
3. From backend/, run pip install -r requirements.txt
4. From backend/, run python init_db.py to create tables
5. From backend/, run python seed_data.py to load sample categories and articles
6. From frontend/, run npm install

## Test Accounts
- Admin: test2@pulsedesk.test
- Editor: amina@pulsedesk.test
(passwords set during registration)

## Features
- Searchable knowledge base with categories and articles
- Role-based access control (Viewer, Editor, Admin)
- Editorial workflow: Editors submit drafts, Admins review and publish
- Secure authentication with bcrypt password hashing
- Embedded chatbot widget with source-article citations