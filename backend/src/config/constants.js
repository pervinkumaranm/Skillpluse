// User Roles
const ROLES = {
  STUDENT: 'student',
  TRAINING_CENTRE: 'training_centre',
  EMPLOYER: 'employer',
  GOVERNMENT: 'government',
};

// Enrollment Statuses
const ENROLLMENT_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  DROPPED: 'Dropped',
};

// Job Statuses
const JOB_STATUS = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  CLOSED: 'Closed',
};

// Application Statuses
const APPLICATION_STATUS = {
  APPLIED: 'Applied',
  UNDER_REVIEW: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  SELECTED: 'Selected',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

// Employment Verification Statuses
const EMPLOYMENT_STATUS = {
  SELF_REPORTED: 'Self Reported',
  PENDING_VERIFICATION: 'Pending Verification',
  EMPLOYER_VERIFIED: 'Employer Verified',
  GOVERNMENT_VERIFIED: 'Government Verified',
  REJECTED: 'Rejected',
};

// Training Program Modes
const TRAINING_MODE = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  HYBRID: 'Hybrid',
};

// Skill Categories
const SKILL_CATEGORIES = [
  'Programming',
  'Web Development',
  'Data Science',
  'Cloud Computing',
  'Cyber Security',
  'AI/ML',
  'Database',
  'DevOps',
  'Mobile Development',
  'Soft Skills',
  'Design',
  'Networking',
  'Manufacturing',
  'Healthcare',
  'Finance',
  'Other',
];

// Maharashtra Districts
const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed',
  'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli',
  'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur',
  'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded',
  'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani',
  'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
  'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal',
];

// Education Levels
const EDUCATION_LEVELS = [
  '10th Pass',
  '12th Pass',
  'Diploma',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'ITI',
  'Other',
];

// Employment Types
const EMPLOYMENT_TYPES = [
  'Full Time',
  'Part Time',
  'Contract',
  'Internship',
  'Freelance',
  'Apprenticeship',
];

// Matching Weights (configurable)
const MATCHING_WEIGHTS = {
  SKILL_MATCH: 0.60,
  TRAINING_COMPLETION: 0.15,
  CERTIFICATION: 0.10,
  EDUCATION: 0.10,
  EXPERIENCE: 0.05,
};

// File Upload
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

module.exports = {
  ROLES,
  ENROLLMENT_STATUS,
  JOB_STATUS,
  APPLICATION_STATUS,
  EMPLOYMENT_STATUS,
  TRAINING_MODE,
  SKILL_CATEGORIES,
  MAHARASHTRA_DISTRICTS,
  EDUCATION_LEVELS,
  EMPLOYMENT_TYPES,
  MATCHING_WEIGHTS,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
};
