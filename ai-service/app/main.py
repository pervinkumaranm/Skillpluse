from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from app.matching.engine import MatchingEngine
from app.matching.skill_gap import SkillGapAnalyzer

app = FastAPI(
    title="SkillPulse AI Service",
    description="Skill Matching Engine for SkillPulse Maharashtra",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---

class StudentJobMatch(BaseModel):
    studentSkills: List[str]
    requiredSkills: List[str]
    preferredSkills: Optional[List[str]] = []

class CandidateProfile(BaseModel):
    id: str
    name: str
    skills: List[str]
    education: Optional[str] = ""
    experience: Optional[int] = 0
    completedTrainings: Optional[int] = 0
    certificates: Optional[int] = 0

class JobCandidateMatch(BaseModel):
    requiredSkills: List[str]
    education: Optional[str] = ""
    candidates: List[CandidateProfile]

class SkillGapRequest(BaseModel):
    studentSkills: List[str]
    requiredSkills: List[str]

# --- Endpoints ---

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "SkillPulse AI Matching Service"}

@app.post("/match/student-job")
async def match_student_job(data: StudentJobMatch):
    engine = MatchingEngine()
    result = engine.match_skills(data.studentSkills, data.requiredSkills)
    return result

@app.post("/match/job-candidates")
async def match_job_candidates(data: JobCandidateMatch):
    engine = MatchingEngine()
    results = []
    for candidate in data.candidates:
        score = engine.calculate_candidate_score(
            candidate_skills=candidate.skills,
            required_skills=data.requiredSkills,
            education=candidate.education or "",
            experience=candidate.experience or 0,
            completed_trainings=candidate.completedTrainings or 0,
            certificates=candidate.certificates or 0,
            required_education=data.education or "",
        )
        results.append({
            "id": candidate.id,
            "name": candidate.name,
            **score,
        })
    results.sort(key=lambda x: x["totalScore"], reverse=True)
    return {"candidates": results}

@app.post("/skill-gap/analyze")
async def analyze_skill_gap(data: SkillGapRequest):
    analyzer = SkillGapAnalyzer()
    result = analyzer.analyze(data.studentSkills, data.requiredSkills)
    return result
