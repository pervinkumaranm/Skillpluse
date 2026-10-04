"""Skill Gap Analyzer"""


class SkillGapAnalyzer:
    def analyze(self, student_skills: list, required_skills: list) -> dict:
        """Analyze skill gaps between student and requirements"""
        normalized_student = [s.lower().strip() for s in student_skills]
        normalized_required = [s.lower().strip() for s in required_skills]

        matched = [s for s in required_skills if s.lower().strip() in normalized_student]
        missing = [s for s in required_skills if s.lower().strip() not in normalized_student]

        match_score = round((len(matched) / len(normalized_required)) * 100) if normalized_required else 0

        recommendations = []
        if missing:
            recommendations.append(
                f"Complete training in: {', '.join(missing[:5])}"
            )
            recommendations.append(
                "Look for training programs covering these skills on the platform."
            )

        return {
            "matchScore": match_score,
            "gapPercentage": 100 - match_score,
            "matchedSkills": matched,
            "missingSkills": missing,
            "recommendations": recommendations,
            "totalRequired": len(required_skills),
            "totalMatched": len(matched),
            "totalMissing": len(missing),
        }
