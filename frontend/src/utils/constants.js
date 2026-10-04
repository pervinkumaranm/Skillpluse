// Maharashtra Districts
export const DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed',
  'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli',
  'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur',
  'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded',
  'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani',
  'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
  'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal',
];

export const ROLES = {
  STUDENT: 'student',
  TRAINING_CENTRE: 'training_centre',
  EMPLOYER: 'employer',
  GOVERNMENT: 'government',
};

export const ROLE_LABELS = {
  student: 'Student',
  training_centre: 'Training Centre',
  employer: 'Employer',
  government: 'Government Officer',
};

export const ROLE_PATHS = {
  student: '/student/dashboard',
  training_centre: '/training/dashboard',
  employer: '/employer/dashboard',
  government: '/government/dashboard',
};

export const EDUCATION_LEVELS = [
  '10th Pass', '12th Pass', 'Diploma', "Bachelor's Degree",
  "Master's Degree", 'PhD', 'ITI', 'Other',
];

export const EMPLOYMENT_TYPES = [
  'Full Time', 'Part Time', 'Contract',
  'Internship', 'Freelance', 'Apprenticeship',
];

export const INDUSTRIES = [
  'Information Technology & Software',
  'Automobile & Manufacturing',
  'Banking & Financial Services',
  'Healthcare & Pharmaceuticals',
  'Construction & Real Estate',
  'Logistics & Supply Chain',
  'Retail & E-commerce',
  'Renewable Energy & Power',
  'Telecommunications',
  'Education & EdTech',
  'Agriculture & Food Processing',
  'Other',
];

export const SKILL_CATEGORIES = [
  'Programming', 'Web Development', 'Data Science', 'Cloud Computing',
  'Cyber Security', 'AI/ML', 'Database', 'DevOps', 'Mobile Development',
  'Soft Skills', 'Design', 'Networking', 'Manufacturing', 'Healthcare',
  'Finance', 'Other',
];

export const STATUS_COLORS = {
  'Pending': 'badge-yellow',
  'Approved': 'badge-blue',
  'In Progress': 'badge-blue',
  'Completed': 'badge-green',
  'Dropped': 'badge-red',
  'Draft': 'badge-gray',
  'Published': 'badge-green',
  'Closed': 'badge-red',
  'Applied': 'badge-blue',
  'Under Review': 'badge-yellow',
  'Shortlisted': 'badge-green',
  'Interview': 'badge-blue',
  'Selected': 'badge-green',
  'Rejected': 'badge-red',
  'Withdrawn': 'badge-gray',
  'Self Reported': 'badge-yellow',
  'Pending Verification': 'badge-yellow',
  'Employer Verified': 'badge-blue',
  'Government Verified': 'badge-green',
  'Active': 'badge-green',
};

export const getMatchScoreClass = (score) => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatSalary = (min, max) => {
  if (!min && !max) return 'Not disclosed';
  const fmt = (n) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n}`;
  };
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `Up to ${fmt(max)}`;
};
