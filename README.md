# 🧬 Curalink — AI Medical Research Assistant

<div align="center">

![Curalink Logo](./curalink-frontend/src/assets/Curalink%20logo.jpg)

**Your AI-powered health research companion**

*Understands user context → Retrieves high-quality medical research → Reasons over it → Delivers structured, personalized, source-backed answers*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-7c3aed?style=for-the-badge)](https://your-deployment-url.com)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge)](https://your-backend-url.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [AI Pipeline Architecture](#-ai-pipeline-architecture)
- [Data Sources](#-data-sources)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## 🎯 Overview

**Curalink** is a full-stack AI-powered Medical Research Assistant built on the **MERN stack**. It acts as a health research companion that intelligently retrieves, ranks, and reasons over real medical literature from multiple live data sources to deliver structured, personalized, research-backed answers.

This is **not just a chatbot** — it is a complete **research + reasoning system** with:

- Role-based user accounts (Patient & Researcher)
- Real-time retrieval from PubMed, OpenAlex, and ClinicalTrials.gov
- Intelligent query expansion and result ranking
- Multi-turn conversation memory
- Community forum, favorites, meetings, and researcher networking

> Built for the **Curalink AI Medical Research Assistant Hackathon**

---

## 🚀 Live Demo

| Service | URL |
|--------|-----|
| 🌐 Frontend | `https://your-deployment-url.vercel.app` |
| ⚙️ Backend API | `https://your-backend-url.onrender.com` |
| ❤️ Health Check | `https://your-backend-url.onrender.com/api/health` |

---

## ✨ Features

### 🤖 Core AI Research Pipeline
- **Intelligent Query Expansion** — Automatically expands user queries by combining disease context + intent keywords + expanded medical terminology
- **Parallel Multi-Source Retrieval** — Fetches 80+ PubMed articles, 80+ OpenAlex papers, and 40+ ClinicalTrials simultaneously using `Promise.all`
- **Smart Ranking Algorithm** — Scores results by relevance (title/abstract keyword match), recency (year weight), and source credibility (PubMed premium bonus)
- **3-Tier LLM Reasoning** — HuggingFace Mistral-7B → Ollama (local) → Structured Research Engine fallback (always works)
- **Multi-turn Context Memory** — Conversations stored in MongoDB with session continuity across follow-up questions
- **Structured Output** — Every response includes Condition Overview, Research Insights, Clinical Trials, Key Takeaways, Summary, and Sources

### 👤 Patient Dashboard
- Profile setup with medical conditions, medications, location, date of birth
- AI Research Assistant with auto-filled conditions from profile
- Publications search with PubMed/OpenAlex source filtering and year range
- Clinical Trials search with recruiting status and phase filtering
- Favorites management (save and remove publications + trials)
- Community Forum with role-tagged posts
- Research Topics Distribution pie chart
- Recent Activity Timeline line chart

### 🔬 Researcher Dashboard
- Professional profile with institution, ORCID ID, specialties, and research interests
- AI Research Tool with persistent chat history across tab navigation
- Publications and Clinical Trials search with advanced filters
- My Network — Discover researchers, send/accept/decline connection requests, direct messaging with connections
- Meetings — Schedule, edit, complete, and delete meetings with full CRUD
- Publications by Category and Saved vs Viewed vs Skipped analytics charts
- Community Forum with Researcher role badge

### 🔐 Authentication & Security
- JWT-based authentication with 7-day token expiry
- Role-based route protection (Patient ↔ Researcher isolation)
- Mandatory profile completion gate before dashboard access
- In-memory session fallback when MongoDB is unavailable

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | Frontend framework and build tool |
| React Router DOM | Client-side routing with protected routes |
| Axios | HTTP client for API calls |
| Recharts | Interactive charts and data visualization |
| ReactMarkdown | Renders AI responses with rich formatting |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JWT + bcryptjs | Authentication and password hashing |
| Axios | External API calls (PubMed, OpenAlex, ClinicalTrials) |
| xml2js | XML parsing for PubMed responses |

### AI / LLM
| Technology | Purpose |
|-----------|---------|
| HuggingFace Inference API | Primary LLM (Mistral-7B-Instruct) |
| Ollama | Secondary local LLM (Llama 3.2 / Mistral) |
| Structured Research Engine | Always-available fallback with real retrieved data |

---

## 🧠 AI Pipeline Architecture

```
User Query
    │
    ▼
┌─────────────────────────────────┐
│      Query Expansion Engine      │
│  disease + intent + terminology  │
└─────────────────────────────────┘
    │
    ▼ (parallel)
┌──────────┐  ┌──────────┐  ┌─────────────────┐
│  PubMed  │  │ OpenAlex │  │ ClinicalTrials  │
│  80 IDs  │  │ 80 works │  │   40 studies    │
│  + fetch │  │ paginated│  │   v2 API        │
└──────────┘  └──────────┘  └─────────────────┘
    │               │                │
    └───────────────┴────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Ranking Service      │
        │ • Relevance score      │
        │ • Recency score        │
        │ • Source credibility   │
        │ → Top 8 pubs + 6 trials│
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │     LLM Reasoning      │
        │ 1. HuggingFace Mistral │
        │ 2. Ollama local LLM    │
        │ 3. Structured fallback │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Structured Response  │
        │ • Condition Overview   │
        │ • Research Insights    │
        │ • Clinical Trials      │
        │ • Key Takeaways        │
        │ • Summary              │
        │ • Sources              │
        └───────────────────────┘
```

### Ranking Formula

```
Total Score = Relevance (0–50) + Recency (0–30) + Source Bonus (0–20)

Relevance:  +10 per keyword in title, +3 per keyword in abstract
Recency:    2024+ = 30pts, 2022+ = 24pts, 2020+ = 16pts, 2018+ = 8pts
Source:     PubMed = 20pts, OpenAlex = 14pts
```

---

## 📡 Data Sources

| Source | Type | Retrieval |
|--------|------|-----------|
| **PubMed (NCBI)** | Peer-reviewed publications | esearch → efetch (2-step XML pipeline) |
| **OpenAlex** | Global research database | Paginated REST API with inverted-index abstract reconstruction |
| **ClinicalTrials.gov v2** | Clinical studies | Structured condition query with status, phase, location |

All APIs are **free and require no API key**.

---

## 📁 Project Structure

```
CuraLink/
├── curalink-backend/
│   ├── controllers/
│   │   ├── authController.js       # Register, login, profile update
│   │   ├── chatController.js       # Main AI pipeline orchestrator
│   │   ├── forumController.js      # Forum CRUD
│   │   ├── meetingController.js    # Meeting CRUD
│   │   ├── networkController.js    # Connection requests + messaging
│   │   └── userController.js       # Favorites + stats
│   ├── middleware/
│   │   └── auth.js                 # JWT protect + role authorize
│   ├── models/
│   │   ├── Conversation.js         # Chat session storage
│   │   ├── DirectMessage.js        # Researcher-to-researcher DMs
│   │   ├── ForumPost.js            # Community forum posts
│   │   ├── Meeting.js              # Scheduled meetings
│   │   ├── NetworkRequest.js       # Connection request tracking
│   │   └── User.js                 # User profiles (patient + researcher)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── forum.js
│   │   ├── meetings.js
│   │   ├── network.js
│   │   ├── research.js
│   │   └── user.js
│   ├── services/
│   │   ├── clinicalTrialsService.js  # ClinicalTrials.gov API
│   │   ├── llmService.js             # 3-tier LLM reasoning
│   │   ├── openAlexService.js        # OpenAlex API + abstract rebuild
│   │   ├── pubmedService.js          # PubMed 2-step pipeline
│   │   └── rankingService.js         # Relevance + recency scoring
│   ├── utils/
│   │   └── queryExpander.js          # Query expansion + disease map
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── curalink-frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── Curalink logo.jpg
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx         # Core AI chat (embedded + standalone)
│   │   │   ├── ProfileCompletionGate.jsx # Mandatory profile setup modal
│   │   │   └── shared/
│   │   │       ├── LoadingSpinner.jsx
│   │   │       ├── TagInput.jsx
│   │   │       └── Toast.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # JWT auth state + localStorage
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── PatientDashboard.jsx      # Full patient experience
│   │   │   └── ResearcherDashboard.jsx   # Full researcher experience
│   │   ├── App.css                       # ChatInterface dark theme
│   │   ├── App.jsx                       # Routes + protected routes
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.local
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🏁 Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB (local) or MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/curalink.git
cd curalink
```

### 2. Backend Setup

```bash
cd curalink-backend
npm install
```

Create `.env` file (see [Environment Variables](#-environment-variables)):

```bash
cp .env.example .env
# Edit .env with your values
```

Start the backend:

```bash
npm run dev
# Server runs on http://localhost:5000
```

Verify it's working:
```bash
curl http://localhost:5000/api/health
# Expected: { "status": "ok", "mongo": "connected" }
```

### 3. Frontend Setup

```bash
cd ../curalink-frontend
npm install
```

Create `.env.local`:

```bash
echo "VITE_API_URL=" > .env.local
```

Start the frontend:

```bash
npm run dev
# App runs on http://localhost:5173
```

### 4. Open the App

Navigate to [http://localhost:5173](http://localhost:5173)

1. Click **"I'm a Patient"** or **"I'm a Researcher"** to register
2. Complete your profile setup
3. Start using the AI Research Assistant

---

## 🔐 Environment Variables

### Backend (`curalink-backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/curalink
# For Atlas: mongodb+srv://user:pass@cluster.mongodb.net/curalink

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# LLM (optional — app works without these via structured fallback)
HF_API_KEY=hf_your_huggingface_api_key_here
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### Frontend (`curalink-frontend/.env.local`)

```env
# Leave empty for local development (uses Vite proxy to port 5000)
VITE_API_URL=

# For production deployment, set to your backend URL:
# VITE_API_URL=https://your-backend.onrender.com
```

> **Note:** The app functions fully without an LLM API key. The Structured Research Engine fallback always works and returns real data from PubMed, OpenAlex, and ClinicalTrials.gov.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login and get JWT | Public |
| GET | `/api/auth/me` | Get current user | 🔒 |
| PUT | `/api/auth/profile` | Update profile | 🔒 |

### Core AI Research
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/chat` | Main AI research pipeline | Optional |
| GET | `/api/chat/history/:sessionId` | Get conversation history | Optional |
| GET | `/api/health` | Server health check | Public |

### User Data
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/favorites` | Get saved items | 🔒 |
| POST | `/api/users/favorites` | Save publication or trial | 🔒 |
| DELETE | `/api/users/favorites/:encodedUrl` | Remove favorite | 🔒 |
| GET | `/api/users/stats` | Get dashboard stats | 🔒 |

### Forum
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/forum` | Get all posts | Public |
| POST | `/api/forum` | Create post | 🔒 |
| DELETE | `/api/forum/:id` | Delete own post | 🔒 |

### Meetings (Researcher)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/meetings` | Get user's meetings | 🔒 |
| POST | `/api/meetings` | Schedule meeting | 🔒 |
| PUT | `/api/meetings/:id` | Update/complete meeting | 🔒 |
| DELETE | `/api/meetings/:id` | Delete meeting | 🔒 |

### Network (Researcher)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/network/researchers` | Discover researchers | 🔒 |
| GET | `/api/network/connections` | Get connections | 🔒 |
| GET | `/api/network/requests` | Incoming requests | 🔒 |
| GET | `/api/network/sent` | Sent requests | 🔒 |
| POST | `/api/network/request` | Send connection request | 🔒 |
| PUT | `/api/network/request/:id` | Accept/decline request | 🔒 |
| DELETE | `/api/network/cancel/:toUserId` | Cancel sent request | 🔒 |
| GET | `/api/network/messages/:userId` | Get DMs | 🔒 |
| POST | `/api/network/messages/:userId` | Send DM | 🔒 |

---

## 🚢 Deployment

### Backend → Render

1. Push code to GitHub
2. Create new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repo
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables from `.env`
7. Deploy

### Frontend → Vercel

1. Create new project on [Vercel](https://vercel.com)
2. Connect your GitHub repo, set root to `curalink-frontend`
3. Set environment variable: `VITE_API_URL=https://your-render-backend.onrender.com`
4. Deploy

### MongoDB → Atlas

1. Create free M0 cluster at [MongoDB Atlas](https://mongodb.com/atlas)
2. Create database user with read/write access
3. Whitelist IP `0.0.0.0/0`
4. Copy connection string and set as `MONGO_URI` in Render

---

## 🧪 Example Queries to Test

| Query | Disease Context | What it demonstrates |
|-------|----------------|----------------------|
| "Latest treatment for lung cancer" | lung cancer | Treatment retrieval + ASCO guidelines |
| "Clinical trials for Parkinson's disease" | Parkinson's disease | ClinicalTrials.gov integration + recruiting status |
| "Top researchers in Alzheimer's disease" | Alzheimer's disease | OpenAlex author retrieval |
| "Recent studies on heart disease" | heart disease | Multi-source publication ranking |
| "Can I take Vitamin D?" *(follow-up)* | *(previous context)* | Multi-turn conversation memory |
| "Deep brain stimulation effectiveness" | Parkinson's disease | Query expansion in action |

---

## 🏆 Evaluation Criteria Coverage

| Criterion | Implementation |
|-----------|---------------|
| 🧠 **AI Pipeline Quality** | 3-tier LLM + structured fallback, always-working responses |
| 🔍 **Retrieval + Ranking Accuracy** | 160+ candidates retrieved, scored by relevance + recency + credibility |
| ⚙️ **Engineering Depth** | MERN stack, JWT auth, role-based access, MongoDB sessions, parallel API calls |
| 🎯 **Usability** | Two role dashboards, profile gates, persistent chat, responsive design |
| 📊 **Data Sources** | PubMed ✅ OpenAlex ✅ ClinicalTrials.gov ✅ |
| 🔄 **Context Awareness** | Multi-turn sessions stored in MongoDB with conversation history |
| 📋 **Structured Output** | Condition Overview → Research Insights → Trials → Takeaways → Summary → Sources |

---

## 👨‍💻 Author

**Atif Ansari**

Built with dedication for the Curalink AI Medical Research Assistant Hackathon.

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**🧬 Curalink — Connecting Research to Reality**

*Sources: PubMed • OpenAlex • ClinicalTrials.gov*

</div>
