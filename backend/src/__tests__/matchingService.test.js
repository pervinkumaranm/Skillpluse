const MatchingService = require('../services/matchingService');

describe('MatchingService', () => {
  describe('calculateSkillMatch', () => {
    it('should correctly calculate exact and partial skill matches', () => {
      const studentSkills = ['React', 'Node.js', 'MongoDB', 'JavaScript'];
      const requiredSkills = ['React', 'Node.js', 'Python', 'AWS'];

      const result = MatchingService.calculateSkillMatch(studentSkills, requiredSkills);

      expect(result.totalRequired).toBe(4);
      expect(result.totalMatched).toBe(2);
      expect(result.totalMissing).toBe(2);
      expect(result.matchScore).toBe(50);
      expect(result.gapPercentage).toBe(50);
      expect(result.matchedSkills).toContain('React');
      expect(result.matchedSkills).toContain('Node.js');
      expect(result.missingSkills).toContain('Python');
      expect(result.missingSkills).toContain('AWS');
    });

    it('should handle case insensitivity and whitespace', () => {
      const studentSkills = ['  react  ', 'NODE.JS'];
      const requiredSkills = ['React', 'node.js'];

      const result = MatchingService.calculateSkillMatch(studentSkills, requiredSkills);

      expect(result.matchScore).toBe(100);
      expect(result.totalMatched).toBe(2);
      expect(result.totalMissing).toBe(0);
    });

    it('should handle empty skills gracefully', () => {
      const result = MatchingService.calculateSkillMatch([], ['Java', 'Spring']);
      expect(result.matchScore).toBe(0);
      expect(result.totalMatched).toBe(0);
      expect(result.totalMissing).toBe(2);
    });
  });

  describe('calculateCandidateScore', () => {
    it('should calculate weighted candidate score correctly', () => {
      const candidate = {
        skills: ['Python', 'SQL', 'Machine Learning'],
        completedTrainings: 1,
        certificates: 1,
        education: "Bachelor's Degree",
        experience: 2,
      };

      const jobRequirements = {
        requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Docker'],
        education: "Bachelor's Degree",
      };

      const result = MatchingService.calculateCandidateScore(candidate, jobRequirements);

      expect(result.totalScore).toBeGreaterThan(0);
      expect(result.breakdown.skillMatch.score).toBe(75);
      expect(result.breakdown.trainingCompletion.score).toBe(100);
      expect(result.breakdown.certification.score).toBe(100);
      expect(result.breakdown.education.score).toBe(100);
      expect(result.breakdown.experience.score).toBe(50);
    });
  });

  describe('rankCandidates', () => {
    it('should rank candidates in descending order of score', () => {
      const candidates = [
        {
          name: 'Candidate A',
          skills: ['Java'],
          completedTrainings: 0,
          certificates: 0,
          education: '12th Pass',
          experience: 0,
        },
        {
          name: 'Candidate B',
          skills: ['Java', 'Spring Boot', 'SQL'],
          completedTrainings: 1,
          certificates: 1,
          education: "Bachelor's Degree",
          experience: 1,
        },
      ];

      const job = {
        requiredSkills: ['Java', 'Spring Boot', 'SQL'],
        education: "Bachelor's Degree",
      };

      const ranked = MatchingService.rankCandidates(candidates, job);

      expect(ranked[0].name).toBe('Candidate B');
      expect(ranked[1].name).toBe('Candidate A');
      expect(ranked[0].matchResult.totalScore).toBeGreaterThan(ranked[1].matchResult.totalScore);
    });
  });
});
