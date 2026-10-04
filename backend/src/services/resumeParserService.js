const fs = require('fs');
const pdfParse = require('pdf-parse');

const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed',
  'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli',
  'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur',
  'Latur', 'Mumbai City', 'Mumbai Suburban', 'Mumbai', 'Nagpur', 'Nanded',
  'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani',
  'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
  'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal',
];

const SKILL_KEYWORDS = [
  // Web & Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
  'HTML', 'HTML5', 'CSS', 'CSS3', 'Sass', 'Tailwind CSS', 'Bootstrap',
  'React', 'React.js', 'Angular', 'Vue.js', 'Next.js', 'Redux',
  'Node.js', 'Express.js', 'Nest.js', 'Spring Boot', 'Django', 'Flask', 'FastAPI', 'ASP.NET',
  // Database & Cloud
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQL', 'SQLite', 'Redis', 'Firebase', 'Oracle',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Git', 'GitHub', 'Linux',
  // Data / AI
  'Machine Learning', 'Deep Learning', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
  'Data Analysis', 'Tableau', 'Power BI', 'Computer Vision', 'NLP',
  // Vocational / Engineering
  'AutoCAD', 'SolidWorks', 'PLC Programming', 'CNC Machining', 'Electrician', 'Welding',
  'Graphic Design', 'Figma', 'UI/UX Design', 'Digital Marketing', 'SEO', 'Cyber Security', 'Network Security',
];

const ROLE_KEYWORDS = [
  'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Software Engineer',
  'Software Developer', 'Web Developer', 'Mobile App Developer', 'Android Developer', 'iOS Developer',
  'DevOps Engineer', 'Cloud Engineer', 'Data Scientist', 'Data Analyst', 'AI/ML Engineer',
  'Quality Assurance Engineer', 'QA Engineer', 'UI/UX Designer', 'Product Manager',
  'System Administrator', 'Network Engineer', 'Cyber Security Analyst', 'Database Administrator',
  'Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 'Technical Support Specialist',
];

/**
 * Extract raw text from file buffer or file path
 */
async function extractRawText(filePath, mimeType) {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    if (mimeType === 'application/pdf' || filePath.toLowerCase().endsWith('.pdf')) {
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text || '';
    }

    // Default plain text / doc / etc.
    return dataBuffer.toString('utf-8');
  } catch (err) {
    console.error('Error extracting text from resume:', err.message);
    return '';
  }
}

/**
 * Parse resume text and extract candidate profile details
 */
function parseResumeText(text) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const parsed = {
    name: '',
    phone: '',
    email: '',
    district: '',
    education: '',
    experience: 0,
    experienceDetails: '',
    preferredRole: '',
    preferredLocation: '',
    about: '',
    skills: [],
  };

  // 1. Phone number extraction (Indian phone patterns: +91, 10 digits starting with 6,7,8,9)
  const phoneMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/) || text.match(/\b\d{10}\b/);
  if (phoneMatch) {
    parsed.phone = phoneMatch[0].replace(/[\s-]/g, '').replace(/^\+91/, '');
  }

  // 2. Email extraction
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    parsed.email = emailMatch[0];
  }

  // 3. Name extraction (heuristic: first clean line that doesn't contain email, phone, http, or resume heading)
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i];
    const lower = line.toLowerCase();
    if (
      !lower.includes('resume') &&
      !lower.includes('curriculum') &&
      !lower.includes('cv') &&
      !lower.includes('@') &&
      !lower.includes('http') &&
      !lower.includes('phone') &&
      !lower.includes('email') &&
      !lower.includes('contact') &&
      !/\d/.test(line) &&
      line.length >= 3 &&
      line.length <= 40 &&
      line.split(/\s+/).length <= 4
    ) {
      parsed.name = line.replace(/[^a-zA-Z\s]/g, '').trim();
      if (parsed.name) break;
    }
  }

  // 4. District & Location detection
  for (const dist of MAHARASHTRA_DISTRICTS) {
    const regex = new RegExp(`\\b${dist}\\b`, 'i');
    if (regex.test(text)) {
      const normalized = dist === 'Mumbai City' || dist === 'Mumbai Suburban' ? 'Mumbai City' : dist;
      parsed.district = normalized;
      parsed.preferredLocation = normalized;
      break;
    }
  }

  // 5. Education detection
  const lowerText = text.toLowerCase();
  if (lowerText.includes('m.tech') || lowerText.includes('master of technology') || lowerText.includes('m.e.')) {
    parsed.education = "Master's Degree";
  } else if (lowerText.includes('mca') || lowerText.includes('m.sc') || lowerText.includes('master of science') || lowerText.includes('mba') || lowerText.includes('master')) {
    parsed.education = "Master's Degree";
  } else if (lowerText.includes('b.tech') || lowerText.includes('bachelor of technology') || lowerText.includes('b.e.') || lowerText.includes('bachelor of engineering')) {
    parsed.education = "Bachelor's Degree";
  } else if (lowerText.includes('bca') || lowerText.includes('b.sc') || lowerText.includes('bachelor of science') || lowerText.includes('b.com') || lowerText.includes('b.a.') || lowerText.includes('bachelor')) {
    parsed.education = "Bachelor's Degree";
  } else if (lowerText.includes('diploma') || lowerText.includes('polytechnic')) {
    parsed.education = 'Diploma';
  } else if (lowerText.includes('iti') || lowerText.includes('industrial training')) {
    parsed.education = 'ITI';
  } else if (lowerText.includes('12th') || lowerText.includes('hsc') || lowerText.includes('higher secondary')) {
    parsed.education = '12th Pass';
  } else if (lowerText.includes('10th') || lowerText.includes('ssc') || lowerText.includes('matriculation')) {
    parsed.education = '10th Pass';
  } else if (lowerText.includes('phd') || lowerText.includes('doctorate')) {
    parsed.education = 'PhD';
  }

  // 6. Experience (in years) detection
  const expMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:\+|plus)?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/i) ||
                   text.match(/experience\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/i);
  if (expMatch) {
    const years = parseFloat(expMatch[1]);
    if (!isNaN(years)) parsed.experience = Math.min(Math.round(years), 25);
  } else if (lowerText.includes('fresher') || lowerText.includes('entry level') || lowerText.includes('0 years')) {
    parsed.experience = 0;
  }

  // 7. Preferred Role detection
  for (const role of ROLE_KEYWORDS) {
    const regex = new RegExp(`\\b${role.replace('/', '\\/')}\\b`, 'i');
    if (regex.test(text)) {
      parsed.preferredRole = role;
      break;
    }
  }

  // 8. Skills extraction
  const foundSkills = new Set();
  for (const skill of SKILL_KEYWORDS) {
    // Escaped regex for skills like C++, C#, .NET
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      foundSkills.add(skill);
    }
  }
  parsed.skills = Array.from(foundSkills);

  // 9. About / Summary extraction
  // Look for sections like Objective, Summary, About Me, Profile
  const summaryHeaderRegex = /(?:professional\s+summary|career\s+objective|profile\s+summary|objective|about\s+me|summary)[\s:]+/i;
  const summaryMatch = text.search(summaryHeaderRegex);
  if (summaryMatch !== -1) {
    const afterHeader = text.slice(summaryMatch).replace(summaryHeaderRegex, '').trim();
    // Grab the first 2-3 sentences or up to next section header
    const paragraphs = afterHeader.split(/\n\s*\n|\r\n\s*\r\n/);
    if (paragraphs.length > 0) {
      let candidateSummary = paragraphs[0].replace(/\s+/g, ' ').trim();
      // Cut off if too long or hits next section
      if (candidateSummary.length > 450) {
        candidateSummary = candidateSummary.slice(0, 447) + '...';
      }
      if (candidateSummary.length > 20) {
        parsed.about = candidateSummary;
      }
    }
  }

  // Fallback summary if none found but role and skills are available
  if (!parsed.about && (parsed.preferredRole || parsed.skills.length > 0)) {
    const roleText = parsed.preferredRole ? `${parsed.preferredRole}` : 'Skilled professional';
    const skillsText = parsed.skills.slice(0, 4).join(', ');
    parsed.about = `${roleText} with strong proficiency in ${skillsText || 'modern industry technologies'}. Dedicated to delivering impactful results and driving technical excellence.`;
  }

  return parsed;
}

module.exports = {
  extractRawText,
  parseResumeText,
};
