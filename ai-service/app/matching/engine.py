"""Skill Matching Engine with weighted scoring"""

MATCHING_WEIGHTS = {
    "SKILL_MATCH": 0.60,
    "TRAINING_COMPLETION": 0.15,
    "CERTIFICATION": 0.10,
    "EDUCATION": 0.10,
    "EXPERIENCE": 0.05,
}

EDUCATION_LEVELS = [
    "10th pass", "12th pass", "diploma", "iti",
    "bachelor's degree", "master's degree", "phd",
]


class MatchingEngine:
    def __init__(self, weights=None):
        self.weights = weights or MATCHING_WEIGHTS

    def match_skills(self, student_skills: list, required_skills: list) -> dict:
        """Calculate skill match between student and job requirements"""
        normalized_student = [s.lower().strip() for s in student_skills]
        normalized_required = [s.lower().strip() for s in required_skills]

        matched = [s for s in required_skills if s.lower().strip() in normalized_student]
        missing = [s for s in required_skills if s.lower().strip() not in normalized_student]

        match_score = round((len(matched) / len(normalized_required)) * 100) if normalized_required else 0
        gap_percentage = 100 - match_score

        return {
            "matchScore": match_score,
            "gapPercentage": gap_percentage,
            "matchedSkills": matched,
            "missingSkills": missing,
            "totalRequired": len(required_skills),
            "totalMatched": len(matched),
            "totalMissing": len(missing),
        }

    def calculate_candidate_score(
        self,
        candidate_skills: list,
        required_skills: list,
        education: str = "",
        experience: int = 0,
        completed_trainings: int = 0,
        certificates: int = 0,
        required_education: str = "",
    ) -> dict:
        """Calculate comprehensive weighted candidate score"""
        # Skill match (60%)
        skill_result = self.match_skills(candidate_skills, required_skills)
        skill_score = skill_result["matchScore"]

        # Training completion (15%)
        training_score = 100 if completed_trainings > 0 else 0

        # Certification (10%)
        cert_score = 100 if certificates > 0 else 0

        # Education match (10%)
        education_score = 0
        if required_education and education:
            req_level = self._get_education_level(required_education)
            cand_level = self._get_education_level(education)
            if cand_level >= req_level and req_level >= 0:
                education_score = 100
            elif cand_level >= 0 and req_level > 0:
                education_score = max(0, round((cand_level / req_level) * 100))

        # Experience (5%)
        experience_score = min(100, experience * 25)

        # Weighted total
        total_score = round(
            skill_score * self.weights["SKILL_MATCH"]
            + training_score * self.weights["TRAINING_COMPLETION"]
            + cert_score * self.weights["CERTIFICATION"]
            + education_score * self.weights["EDUCATION"]
            + experience_score * self.weights["EXPERIENCE"]
        )

        return {
            "totalScore": total_score,
            "breakdown": {
                "skillMatch": round(skill_score * self.weights["SKILL_MATCH"]),
                "trainingCompletion": round(training_score * self.weights["TRAINING_COMPLETION"]),
                "certification": round(cert_score * self.weights["CERTIFICATION"]),
                "education": round(education_score * self.weights["EDUCATION"]),
                "experience": round(experience_score * self.weights["EXPERIENCE"]),
            },
            "skillDetails": skill_result,
        }

    def _get_education_level(self, education: str) -> int:
        """Get numeric education level for comparison"""
        edu_lower = education.lower().strip()
        for i, level in enumerate(EDUCATION_LEVELS):
            if level in edu_lower or edu_lower in level:
                return i
        return -1
