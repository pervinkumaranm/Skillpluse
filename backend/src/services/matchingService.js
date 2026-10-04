const { MATCHING_WEIGHTS } = require('../config/constants');

class MatchingService {
  /**
   * Calculate skill match between a student and a job
   * @param {Array} studentSkills - Student's skills
   * @param {Array} requiredSkills - Job's required skills
   * @returns {Object} - Match result
   */
  static calculateSkillMatch(studentSkills, requiredSkills) {
    const normalizedStudentSkills = studentSkills.map((s) => s.toLowerCase().trim());
    const normalizedRequiredSkills = requiredSkills.map((s) => s.toLowerCase().trim());

    const matchedSkills = [];
    const missingSkills = [];

    normalizedRequiredSkills.forEach((skill) => {
      if (normalizedStudentSkills.includes(skill)) {
        // Preserve original casing from required skills
        const originalSkill = requiredSkills.find(
          (s) => s.toLowerCase().trim() === skill
        );
        matchedSkills.push(originalSkill || skill);
      } else {
        const originalSkill = requiredSkills.find(
          (s) => s.toLowerCase().trim() === skill
        );
        missingSkills.push(originalSkill || skill);
      }
    });

    const matchScore =
      normalizedRequiredSkills.length > 0
        ? Math.round(
            (matchedSkills.length / normalizedRequiredSkills.length) * 100
          )
        : 0;

    const gapPercentage = 100 - matchScore;

    return {
      matchScore,
      gapPercentage,
      matchedSkills,
      missingSkills,
      totalRequired: requiredSkills.length,
      totalMatched: matchedSkills.length,
      totalMissing: missingSkills.length,
    };
  }

  /**
   * Calculate comprehensive candidate score using weighted formula
   * @param {Object} candidate - Candidate data
   * @param {Object} jobRequirements - Job requirements
   * @param {Object} weights - Optional custom weights
   * @returns {Object} - Weighted score result
   */
  static calculateCandidateScore(candidate, jobRequirements, weights = MATCHING_WEIGHTS) {
    // Skill match (60%)
    const skillResult = this.calculateSkillMatch(
      candidate.skills || [],
      jobRequirements.requiredSkills || []
    );
    const skillScore = skillResult.matchScore;

    // Training completion (15%)
    const trainingScore = candidate.completedTrainings > 0 ? 100 : 0;

    // Certification (10%)
    const certScore = candidate.certificates > 0 ? 100 : 0;

    // Education match (10%)
    let educationScore = 0;
    if (jobRequirements.education && candidate.education) {
      const educationLevels = [
        '10th pass',
        '12th pass',
        'diploma',
        'iti',
        "bachelor's degree",
        "master's degree",
        'phd',
      ];
      const reqLevel = educationLevels.indexOf(
        jobRequirements.education.toLowerCase()
      );
      const candLevel = educationLevels.indexOf(
        candidate.education.toLowerCase()
      );
      if (candLevel >= reqLevel && reqLevel >= 0) {
        educationScore = 100;
      } else if (candLevel >= 0 && reqLevel >= 0) {
        educationScore = Math.max(0, (candLevel / reqLevel) * 100);
      }
    }

    // Experience (5%)
    let experienceScore = 0;
    if (candidate.experience > 0) {
      experienceScore = Math.min(100, candidate.experience * 25);
    }

    // Weighted total
    const totalScore = Math.round(
      skillScore * weights.SKILL_MATCH +
        trainingScore * weights.TRAINING_COMPLETION +
        certScore * weights.CERTIFICATION +
        educationScore * weights.EDUCATION +
        experienceScore * weights.EXPERIENCE
    );

    return {
      totalScore,
      breakdown: {
        skillMatch: { score: skillScore, weight: weights.SKILL_MATCH, weighted: Math.round(skillScore * weights.SKILL_MATCH) },
        trainingCompletion: { score: trainingScore, weight: weights.TRAINING_COMPLETION, weighted: Math.round(trainingScore * weights.TRAINING_COMPLETION) },
        certification: { score: certScore, weight: weights.CERTIFICATION, weighted: Math.round(certScore * weights.CERTIFICATION) },
        education: { score: educationScore, weight: weights.EDUCATION, weighted: Math.round(educationScore * weights.EDUCATION) },
        experience: { score: experienceScore, weight: weights.EXPERIENCE, weighted: Math.round(experienceScore * weights.EXPERIENCE) },
      },
      skillDetails: skillResult,
    };
  }

  /**
   * Rank multiple candidates for a job
   * @param {Array} candidates - Array of candidate data
   * @param {Object} jobRequirements - Job requirements
   * @returns {Array} - Ranked candidates with scores
   */
  static rankCandidates(candidates, jobRequirements) {
    const scoredCandidates = candidates.map((candidate) => {
      const scoreResult = this.calculateCandidateScore(candidate, jobRequirements);
      return {
        ...candidate,
        matchResult: scoreResult,
      };
    });

    // Sort by total score descending
    scoredCandidates.sort((a, b) => b.matchResult.totalScore - a.matchResult.totalScore);

    return scoredCandidates;
  }
}

module.exports = MatchingService;
