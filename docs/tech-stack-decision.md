# PulseDesk-KB — Tech Stack Decision Log

## Frontend: React + Tailwind CSS
Chosen for component-based UI development and fast, utility-first styling. Matches the PRD's recommended stack and gives strong control over the search-first, documentation-style layout planned in the competitive analysis.

## Backend: FastAPI (Python)
Chosen for fast development speed, automatic API documentation, and strong fit with Python — a language covered in coursework. Well suited to building the REST API and the KB Assistant's retrieval logic.

## Database: PostgreSQL
Chosen for strong reliability, native support for full-text search (reducing the need for a separate search engine like Elasticsearch), and solid relational structure for the ERD already designed (Articles, Categories, Users, Tags, Feedback, Media).