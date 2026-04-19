# 🧬 Curalink — AI Medical Research Assistant

<div align="center">

![Curalink Logo](curalink-frontend/src/assets/Curalink%20logo.jpg)

**Your intelligent companion for medical research, clinical trials, and personalized health insights.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://cura-link-mark1.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://curalink-9la1.onrender.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://react.dev)

</div>

---

## 📌 Overview

Curalink is a full-stack AI-powered medical research assistant built on the **MERN stack**. It acts as a health research companion that:

> **Understands user context → retrieves high-quality medical research → reasons over it → delivers structured, personalized, and source-backed answers.**

This is not just a chatbot — it is a **research + reasoning system** that searches across three live medical databases simultaneously, ranks results intelligently, and generates structured responses using an open-source LLM pipeline.

---

## 🌐 Live Application

| Service | URL |
|---|---|
| 🌍 Frontend (Vercel) | [https://cura-link-mark1.vercel.app/](https://cura-link-mark1.vercel.app/) |
| ⚙️ Backend (Render) | [https://curalink-9la1.onrender.com](https://curalink-9la1.onrender.com) |
| 🔍 Health Check | [https://curalink-9la1.onrender.com/api/health](https://curalink-9la1.onrender.com/api/health) |

---

## 📸 Screenshots

### Landing Page:

<img width="1831" height="907" alt="image" src="https://github.com/user-attachments/assets/5f5239bb-ee3e-413b-b72d-a5d271fb5c6e" /> &emsp;

<img width="1854" height="893" alt="image" src="https://github.com/user-attachments/assets/02665b3b-5acb-498b-963a-492c81863455" />

### Patient Dashboard:

<img width="1899" height="908" alt="image" src="https://github.com/user-attachments/assets/596b4173-106a-44fe-a4f7-8014f6422a13" />

### AI Chat Interfact:

<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/d392a819-fe9c-4306-a39c-ed65d4740057" />

### Researcher Dashboard:

<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/997cbf76-a618-46a8-bb84-e01aece39a69" />


---

## ✨ Features

### 🤖 AI Research Pipeline (Core Feature)
- **Intelligent Query Expansion** — automatically combines disease context + user query into optimized search terms
- **Parallel Multi-Source Retrieval** — simultaneously fetches from PubMed (80+ results), OpenAlex (80+ results), and ClinicalTrials.gov (40+ results)
- **Smart Re-Ranking** — scores results by relevance, recency, and source credibility before showing top 8
- **Three-Tier LLM** — HuggingFace Mistral-7B → Ollama (local) → Structured Research Engine (always-on fallback)
- **Multi-turn Context Memory** — conversations persist across sessions via MongoDB with in-memory fallback
- **Structured Responses** — every answer includes Condition Overview, Research Insights, Clinical Trials, Key Takeaways, Summary, and Sources

### 👤 Dual Role System
- **Patient / Caregiver** — personalized research based on medical conditions
- **Researcher** — professional tools for literature search, collaboration, and trial management
- Role-based access control — users can only access their own dashboard

### 🏥 Patient Dashboard
- AI Research Assistant with auto-filled condition from profile
- Publications search with PubMed/OpenAlex source filters
- Clinical Trials search with status and phase filters
- Save favorites (publications + trials)
- Community Forum with role badges
- Profile management with medical conditions and medications as tag selection
- Overview charts: Research Topics Distribution (pie) + Recent Activity Timeline (line)

### 🔬 Researcher Dashboard
- AI Research Tool with research interest context
- My Network — discover researchers, send/accept/decline connection requests, direct messaging
- Meetings — schedule, manage, and mark meetings complete
- Publications and Clinical Trials search with save to favorites
- Community Forum (shared with patients, researcher badge shown)
- Profile with specialties and research interests as clickable tag selection
- Overview charts: Publications by Category (pie) + Saved vs Viewed vs Skipped (bar)

### 🔐 Authentication & Security
- JWT-based authentication with 7-day tokens
- Bcrypt password hashing (12 salt rounds)
- Protected routes with role-based guards
- Profile completion gate — users must set up their profile before accessing dashboard
- Session persistence via localStorage

---

## 🧠 AI Pipeline Architecture

```
User Query
    │
    ▼
┌─────────────────────────────────┐
│        Query Expansion          │
│  disease + intent → expanded    │
│  terms + related keywords       │
└─────────────────────────────────┘
    │
    ▼ (parallel)
┌──────────┐  ┌──────────┐  ┌──────────────────┐
│  PubMed  │  │ OpenAlex │  │ ClinicalTrials   │
│  (80+)   │  │  (80+)   │  │     .gov (40+)   │
└──────────┘  └──────────┘  └──────────────────┘
    │               │                │
    └───────────────┴────────────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │   Ranking Engine    │
        │  relevance + recency│
        │  + credibility score│
        └─────────────────────┘
                    │
                    ▼ (top 8 pubs + top 6 trials)
        ┌─────────────────────┐
        │   LLM Reasoning     │
        │  1. HuggingFace     │
        │  2. Ollama (local)  │
        │  3. Structured      │
        │     Fallback Engine │
        └─────────────────────┘
                    │
                    ▼
        Structured Response
        (Sections + Sources + Summary)
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| React Router v6 | Client-side routing |
| Recharts | Interactive charts and data visualization |
| Axios | HTTP client |
| ReactMarkdown | Structured response rendering |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Token | Authentication |
| Bcryptjs | Password hashing |
| Axios | External API calls |
| xml2js | PubMed XML parsing |

### AI / LLM
| Technology | Purpose |
|---|---|
| HuggingFace Inference API | Mistral-7B-Instruct primary LLM |
| Ollama (optional) | Local LLM fallback |
| Custom Structured Engine | Always-on research-based fallback |

### Data Sources
| API | Data |
|---|---|
| [PubMed (NCBI E-utilities)](https://www.ncbi.nlm.nih.gov/home/develop/api/) | Peer-reviewed medical publications |
| [OpenAlex](https://openalex.org/) | 200M+ global research papers |
| [ClinicalTrials.gov v2](https://clinicaltrials.gov/data-api/api) | Active and completed clinical trials |

---

## 📁 Project Structure

```
CuraLink/
├── curalink-backend/
│   ├── controllers/
│   │   ├── authController.js       # Register, login, profile
│   │   ├── chatController.js       # Main AI pipeline orchestrator
│   │   ├── forumController.js      # Community forum CRUD
│   │   ├── meetingController.js    # Meeting management
│   │   ├── networkController.js    # Connection requests + messaging
│   │   └── userController.js      # Favorites, stats
│   ├── middleware/
│   │   └── auth.js                 # JWT protect + role authorize
│   ├── models/
│   │   ├── Conversation.js         # Chat session history
│   │   ├── DirectMessage.js        # Network direct messages
│   │   ├── ForumPost.js            # Forum posts
│   │   ├── Meeting.js              # Researcher meetings
│   │   ├── NetworkRequest.js       # Connection requests
│   │   └── User.js                 # User accounts + profiles
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
│   │   ├── llmService.js             # 3-tier LLM + structured fallback
│   │   ├── openAlexService.js        # OpenAlex API + pagination
│   │   ├── pubmedService.js          # PubMed 2-step search + parse
│   │   └── rankingService.js         # Relevance + recency ranking
│   ├── utils/
│   │   └── queryExpander.js          # Query expansion + disease map
│   └── server.js
│
└── curalink-frontend/
    ├── src/
    │   ├── assets/
    │   │   └── Curalink logo.jpg
    │   ├── components/
    │   │   ├── ChatInterface.jsx       # Core AI chat (embedded + standalone)
    │   │   ├── ProfileCompletionGate.jsx
    │   │   └── shared/
    │   ├── context/
    │   │   └── AuthContext.jsx         # Auth state + JWT management
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── PatientDashboard.jsx
    │   │   └── ResearcherDashboard.jsx
    │   ├── App.jsx
    │   ├── App.css                     # ChatInterface dark theme only
    │   └── main.jsx
    └── vite.config.js
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |

### AI Research (Core)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/chat` | Full AI research pipeline | Optional |
| GET | `/api/chat/history/:sessionId` | Chat history | ❌ |

### User Data
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users/favorites` | Get saved items | ✅ |
| POST | `/api/users/favorites` | Save a publication/trial | ✅ |
| DELETE | `/api/users/favorites/:encodedUrl` | Remove favorite | ✅ |
| GET | `/api/users/stats` | Dashboard stats | ✅ |

### Forum
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/forum` | All posts | ❌ |
| POST | `/api/forum` | Create post | ✅ |
| DELETE | `/api/forum/:id` | Delete own post | ✅ |

### Meetings (Researcher)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/meetings` | Get my meetings | ✅ |
| POST | `/api/meetings` | Create meeting | ✅ |
| PUT | `/api/meetings/:id` | Update / mark complete | ✅ |
| DELETE | `/api/meetings/:id` | Delete meeting | ✅ |

### Network (Researcher)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/network/researchers` | Discover researchers | ✅ |
| GET | `/api/network/connections` | My connections | ✅ |
| GET | `/api/network/requests` | Incoming requests | ✅ |
| GET | `/api/network/sent` | Sent requests | ✅ |
| POST | `/api/network/request` | Send request | ✅ |
| PUT | `/api/network/request/:id` | Accept / decline | ✅ |
| DELETE | `/api/network/cancel/:toUserId` | Cancel sent request | ✅ |
| GET | `/api/network/messages/:userId` | Direct messages | ✅ |
| POST | `/api/network/messages/:userId` | Send message | ✅ |

---

## 🔑 Environment Variables

### Backend (`curalink-backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/curalink
JWT_SECRET=your_jwt_secret_here
HF_API_KEY=your_huggingface_api_key_here
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### Frontend (`curalink-frontend/.env.local`)
```env
VITE_API_URL=
```

> **Note:** `VITE_API_URL` is empty for local development (Vite proxy handles it). Set it to your backend URL for production.

---

## 🏃 Running Locally

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend
```bash
cd curalink-backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd curalink-frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Verify
```bash
curl http://localhost:5000/api/health
# Expected: { "status": "ok", "services": { "mongodb": "connected", "llm": "structured-fallback-ready" } }
```

---

## 🧪 Example Queries

Try these in the AI Research Assistant after setting a condition:

| Condition | Query |
|---|---|
| Lung Cancer | "Latest immunotherapy treatments in 2024" |
| Parkinson's Disease | "What is deep brain stimulation and how effective is it?" |
| Diabetes | "Clinical trials for type 2 diabetes management" |
| Alzheimer's | "Early diagnosis methods and biomarkers" |
| Heart Disease | "Recent studies on cardiovascular prevention" |

---

## 📊 Ranking Algorithm

The retrieval pipeline fetches a broad candidate pool (160+ results) and ranks using a weighted scoring system:

```
Total Score = Relevance Score + Recency Score + Source Score + Quality Score

Relevance:  +10 per keyword in title, +3 per keyword in abstract (max 50)
Recency:    2024+ = 30pts, 2022+ = 24pts, 2020+ = 16pts, 2018+ = 8pts
Source:     PubMed = 20pts, OpenAlex = 14pts
Quality:    Has abstract (>80 chars) = +10pts

Clinical Trial Ranking:
Recruiting = 35pts, Active = 25pts, Completed = 12pts
+ Disease match bonus (12pts/word, max 36)
+ Has contact info = +8pts
+ Has location = +8pts
```

---

## 🏆 Hackathon Context

This project was built for the **Curalink AI Medical Research Assistant Hackathon**.

**Evaluation Criteria Met:**
- ✅ AI pipeline quality — 3-tier LLM with intelligent fallback
- ✅ Retrieval + ranking accuracy — 160+ candidates → top 8 with weighted scoring
- ✅ Engineering depth — full MERN stack, JWT auth, role system, real-time data
- ✅ Usability — dual role dashboards, profile completion, responsive design
- ✅ Data sources — PubMed + OpenAlex + ClinicalTrials.gov all integrated

---

## 👨‍💻 Author

**Atif Ansari**

> Built with dedication for the Curalink Hackathon. This project demonstrates how AI can democratize access to medical research for both patients and researchers.

---

## 📄 License

This project is built for hackathon purposes. All medical data is sourced from publicly available APIs (PubMed, OpenAlex, ClinicalTrials.gov).

> ⚕️ **Medical Disclaimer:** Curalink is a research tool only. All information provided is for educational purposes. Always consult a qualified medical professional before making any health decisions.

---

<div align="center">
  <strong>🧬 Curalink — Connect. Discover. Advance.</strong><br/>
  <em>Sources: PubMed • OpenAlex • ClinicalTrials.gov</em>
</div>
