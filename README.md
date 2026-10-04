# SkillPulse Maharashtra

**"From Skills to Employment"**

An intelligent skilling and employment ecosystem for Maharashtra — built for the Smart India Hackathon (SIH).

---

## Overview

SkillPulse Maharashtra is a full-stack platform that connects **Students**, **Training Centres**, **Employers**, and **Government Officers** to track the complete journey from skill assessment through employment verification.

### Key Features

- **Skill Gap Analysis** — Compare student skills against job requirements
- **Smart Job Matching** — AI-powered matching of candidates to jobs
- **Reverse Matching Engine** — Employers find suitable trained candidates
- **Training Tracking** — End-to-end training lifecycle management
- **Employment Verification** — Multi-level employment verification
- **Government Analytics** — District-wise analytics and reports

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Recharts, Lucide React |
| Backend | Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt |
| AI Service | Python, FastAPI, pandas, scikit-learn |

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Python 3.9+
- npm or yarn

### 1. Clone & Setup

```bash
git clone <repository-url>
cd skillpulse

# Copy environment file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 5. Seed Demo Data

```bash
cd backend
npm run seed
```

---

## Demo Credentials

> ⚠️ These are fictional demo accounts for testing only.

| Role | Email | Password |
|---|---|---|
| Student | demo.student@skillpulse.in | Demo@123 |
| Training Centre | demo.training@skillpulse.in | Demo@123 |
| Employer | demo.employer@skillpulse.in | Demo@123 |
| Government Officer | demo.govt@skillpulse.in | Demo@123 |

---

## Project Structure

```
skillpulse/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express API
├── ai-service/        # Python FastAPI matching service
├── database/          # Seed data and schemas
├── docs/              # Documentation
├── .env.example       # Environment template
├── .gitignore
└── README.md
```

---

## API Documentation

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |

### Students
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/students/profile | Get student profile |
| PUT | /api/students/profile | Update profile |
| GET | /api/students/skills | Get skills |
| PUT | /api/students/skills | Update skills |
| GET | /api/students/skill-gap | Get skill gap analysis |
| GET | /api/students/recommended-jobs | Get recommended jobs |

### Training Programs
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/trainings | List programs |
| POST | /api/trainings | Create program |
| GET | /api/trainings/:id | Get program |
| PUT | /api/trainings/:id | Update program |
| DELETE | /api/trainings/:id | Delete program |
| POST | /api/trainings/:id/enroll | Enroll student |

### Jobs
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/jobs | List jobs |
| POST | /api/jobs | Create job |
| GET | /api/jobs/:id | Get job |
| PUT | /api/jobs/:id | Update job |
| DELETE | /api/jobs/:id | Delete job |
| POST | /api/jobs/:id/apply | Apply for job |

### Matching
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/matching/job-candidates | Find candidates for job |
| POST | /api/matching/student-jobs | Find jobs for student |

### Employment
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/employment | Report employment |
| PUT | /api/employment/:id/verify | Verify employment |
| GET | /api/employment | List employment records |

### Government
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/government/overview | Dashboard overview |
| GET | /api/government/districts | District analytics |
| GET | /api/government/skills | Skill analytics |
| GET | /api/government/training-effectiveness | Training effectiveness |
| GET | /api/government/employment | Employment reports |

---

## License

This project was built for the Smart India Hackathon (SIH). All demo data is fictional.

---

**Team SkillPulse** | Smart India Hackathon 2026
