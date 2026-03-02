# RealMeta Museum PWA

A production-focused Progressive Web App for museum experiences, including artwork recognition, AI-powered guides, interactive navigation, and visitor analytics.

![GitHub repo size](https://img.shields.io/github/repo-size/kajalkamble0713-jpg/RealMeta-Museum-PWA)
![GitHub contributors](https://img.shields.io/github/contributors/kajalkamble0713-jpg/RealMeta-Museum-PWA)
![GitHub license](https://img.shields.io/github/license/kajalkamble0713-jpg/RealMeta-Museum-PWA)
![GitHub last commit](https://img.shields.io/github/last-commit/kajalkamble0713-jpg/RealMeta-Museum-PWA)

## Features

### Frontend (React + TypeScript + Vite)
- Installable PWA with offline-capable behavior
- Camera-based artwork scanner
- AI chatbot for artwork Q&A
- Interactive museum map and navigation
- Audio narration for exhibits
- Admin dashboard UI
- No-login visitor flow

### Backend (Node.js + Express)
- REST API for artworks, chat, map, and analytics
- Image processing pipeline for artwork identification
- AI integrations (OpenAI / Gemini-ready setup)
- Caching and request rate limiting
- Security middleware (Helmet, CORS)
- Docker-ready service setup

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Radix UI
- Backend: Node.js, Express
- Integrations: OpenAI, Google Generative AI, Firebase Admin
- DevOps: Docker, Docker Compose, Nginx

## Project Structure

```text
RealMeta Museum PWA/
|-- src/                  # Frontend source
|-- public/               # Static assets
|-- backend/              # API service
|   |-- src/
|   |-- .env.example
|   `-- package.json
|-- scripts/              # Utility scripts (encoding checks, etc.)
|-- docker-compose.yml
|-- nginx.conf
|-- README_FULL.md
`-- DEPLOYMENT_GUIDE.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- Docker (optional, for containerized setup)

### 1) Clone and enter the app

```bash
git clone <repository-url>
cd "RealMeta Museum PWA"
```

### 2) Install dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 3) Configure environment files

```bash
# Frontend env
cp .env.example .env

# Backend env
cp backend/.env.example backend/.env
```

Update both `.env` files with your keys and endpoints.

### 4) Run in development

Open two terminals:

```bash
# Terminal 1: backend
cd backend
npm run dev
```

```bash
# Terminal 2: frontend
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Docker Deployment

```bash
docker-compose up -d --build
docker-compose logs -f
```

Default app entrypoint: `http://localhost`

## API Overview

Base URL: `http://localhost:5000/api`

- Artworks: list, get by ID, create/update/delete
- Recognition: image identify, AI info, narration
- Chat: message + conversation history
- Analytics: event tracking + summaries
- Admin: login + dashboard endpoints
- Map: active museum map data

## Useful Scripts

### Frontend
- `npm run dev`
- `npm run build`
- `npm run lint:encoding`
- `npm run fix:encoding`

### Backend
- `npm run dev`
- `npm start`

## Documentation

- `README_FULL.md` for full details
- `DEPLOYMENT_GUIDE.md` for production deployment
- `QUICKSTART.md` for quick local setup
- `OPENROUTER_SETUP.md` and `SETUP_AI_VISION.md` for AI configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a pull request

## License

This project is licensed under the MIT License.
