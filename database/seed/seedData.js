/**
 * SkillPulse Maharashtra — Seed Script
 * Creates demo data for all entities
 * 
 * Run: npm run seed (from backend directory)
 * 
 * WARNING: This will DELETE all existing data and create fresh demo data.
 * All credentials use fictional demo accounts.
 */

const path = require('path');
module.paths.push(path.join(__dirname, '../../backend/node_modules'));
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('../../backend/src/models/User');
const StudentProfile = require('../../backend/src/models/StudentProfile');
const EmployerProfile = require('../../backend/src/models/EmployerProfile');
const TrainingCentre = require('../../backend/src/models/TrainingCentre');
const Skill = require('../../backend/src/models/Skill');
const TrainingProgram = require('../../backend/src/models/TrainingProgram');
const Enrollment = require('../../backend/src/models/Enrollment');
const Assessment = require('../../backend/src/models/Assessment');
const Certificate = require('../../backend/src/models/Certificate');
const Job = require('../../backend/src/models/Job');
const JobApplication = require('../../backend/src/models/JobApplication');
const Employment = require('../../backend/src/models/Employment');
const Notification = require('../../backend/src/models/Notification');
const District = require('../../backend/src/models/District');

const DEMO_PASSWORD = 'Demo@123';

const seedDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all collections
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      EmployerProfile.deleteMany({}),
      TrainingCentre.deleteMany({}),
      Skill.deleteMany({}),
      TrainingProgram.deleteMany({}),
      Enrollment.deleteMany({}),
      Assessment.deleteMany({}),
      Certificate.deleteMany({}),
      Job.deleteMany({}),
      JobApplication.deleteMany({}),
      Employment.deleteMany({}),
      Notification.deleteMany({}),
      District.deleteMany({}),
    ]);

    // ============ DISTRICTS ============
    console.log('📍 Creating districts...');
    const districtData = [
      { name: 'Mumbai City', code: 'MUM', region: 'Konkan' },
      { name: 'Mumbai Suburban', code: 'MBS', region: 'Konkan' },
      { name: 'Pune', code: 'PUN', region: 'Western Maharashtra' },
      { name: 'Nagpur', code: 'NAG', region: 'Vidarbha' },
      { name: 'Nashik', code: 'NSK', region: 'Northern Maharashtra' },
      { name: 'Thane', code: 'THN', region: 'Konkan' },
      { name: 'Aurangabad', code: 'AUR', region: 'Marathwada' },
      { name: 'Kolhapur', code: 'KOL', region: 'Western Maharashtra' },
      { name: 'Solapur', code: 'SOL', region: 'Western Maharashtra' },
      { name: 'Amravati', code: 'AMR', region: 'Vidarbha' },
      { name: 'Satara', code: 'SAT', region: 'Western Maharashtra' },
      { name: 'Sangli', code: 'SAN', region: 'Western Maharashtra' },
      { name: 'Jalgaon', code: 'JAL', region: 'Northern Maharashtra' },
      { name: 'Akola', code: 'AKO', region: 'Vidarbha' },
      { name: 'Latur', code: 'LAT', region: 'Marathwada' },
      { name: 'Ahmednagar', code: 'AHM', region: 'Western Maharashtra' },
      { name: 'Chandrapur', code: 'CHN', region: 'Vidarbha' },
      { name: 'Palghar', code: 'PAL', region: 'Konkan' },
      { name: 'Raigad', code: 'RGD', region: 'Konkan' },
      { name: 'Ratnagiri', code: 'RTN', region: 'Konkan' },
    ];
    await District.insertMany(districtData);

    // ============ SKILLS ============
    console.log('🎯 Creating master skills...');
    const skillsData = [
      { name: 'Java', category: 'Programming', demandScore: 85 },
      { name: 'Python', category: 'Programming', demandScore: 92 },
      { name: 'JavaScript', category: 'Web Development', demandScore: 88 },
      { name: 'React', category: 'Web Development', demandScore: 82 },
      { name: 'Node.js', category: 'Web Development', demandScore: 78 },
      { name: 'SQL', category: 'Database', demandScore: 90 },
      { name: 'MongoDB', category: 'Database', demandScore: 65 },
      { name: 'HTML', category: 'Web Development', demandScore: 70 },
      { name: 'CSS', category: 'Web Development', demandScore: 68 },
      { name: 'Git', category: 'DevOps', demandScore: 80 },
      { name: 'Spring Boot', category: 'Programming', demandScore: 72 },
      { name: 'Cloud Computing', category: 'Cloud Computing', demandScore: 88 },
      { name: 'AWS', category: 'Cloud Computing', demandScore: 85 },
      { name: 'Docker', category: 'DevOps', demandScore: 75 },
      { name: 'Data Analytics', category: 'Data Science', demandScore: 82 },
      { name: 'Machine Learning', category: 'AI/ML', demandScore: 78 },
      { name: 'Cyber Security', category: 'Cyber Security', demandScore: 86 },
      { name: 'TypeScript', category: 'Programming', demandScore: 74 },
      { name: 'C++', category: 'Programming', demandScore: 60 },
      { name: 'Excel', category: 'Soft Skills', demandScore: 55 },
      { name: 'Communication', category: 'Soft Skills', demandScore: 70 },
      { name: 'Angular', category: 'Web Development', demandScore: 65 },
      { name: 'DevOps', category: 'DevOps', demandScore: 76 },
      { name: 'Linux', category: 'Networking', demandScore: 72 },
      { name: 'Power BI', category: 'Data Science', demandScore: 68 },
    ];
    await Skill.insertMany(skillsData);

    // ============ USERS ============
    console.log('👤 Creating demo users...');
    const hashedPassword = DEMO_PASSWORD; // User model pre('save') hook hashes it automatically

    // Students
    const students = await User.create([
      { name: 'Aarav Sharma', email: 'demo.student@skillpulse.in', password: hashedPassword, role: 'student', phone: '9876543210', district: 'Pune' },
      { name: 'Priya Patel', email: 'priya.student@skillpulse.in', password: hashedPassword, role: 'student', phone: '9876543211', district: 'Mumbai City' },
      { name: 'Rohan Deshmukh', email: 'rohan.student@skillpulse.in', password: hashedPassword, role: 'student', phone: '9876543212', district: 'Nagpur' },
      { name: 'Sneha Kulkarni', email: 'sneha.student@skillpulse.in', password: hashedPassword, role: 'student', phone: '9876543213', district: 'Nashik' },
      { name: 'Vikram Joshi', email: 'vikram.student@skillpulse.in', password: hashedPassword, role: 'student', phone: '9876543214', district: 'Thane' },
    ]);

    // Student Profiles
    await StudentProfile.create([
      { user: students[0]._id, education: "Bachelor's Degree", skills: ['Java', 'HTML', 'CSS'], experience: 0, preferredRole: 'Software Developer', preferredLocation: 'Pune', about: 'Computer Science graduate looking for software development roles.' },
      { user: students[1]._id, education: "Master's Degree", skills: ['Python', 'SQL', 'Data Analytics', 'Machine Learning'], experience: 1, preferredRole: 'Data Analyst', preferredLocation: 'Mumbai', about: 'Data science enthusiast with ML expertise.' },
      { user: students[2]._id, education: "Bachelor's Degree", skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'], experience: 0, preferredRole: 'Full Stack Developer', preferredLocation: 'Nagpur', about: 'Full-stack web developer.' },
      { user: students[3]._id, education: 'Diploma', skills: ['HTML', 'CSS', 'Excel'], experience: 0, preferredRole: 'Web Designer', preferredLocation: 'Nashik', about: 'Looking to build web development skills.' },
      { user: students[4]._id, education: "Bachelor's Degree", skills: ['Java', 'SQL', 'Spring Boot', 'Git', 'Cloud Computing'], experience: 2, preferredRole: 'Backend Developer', preferredLocation: 'Thane', about: 'Experienced Java developer.' },
    ]);

    // Training Centre
    const trainingUser = await User.create({
      name: 'Maharashtra Skills Academy', email: 'demo.training@skillpulse.in',
      password: hashedPassword, role: 'training_centre', phone: '9876543220', district: 'Pune',
    });
    const trainingCentre = await TrainingCentre.create({
      user: trainingUser._id, centreName: 'Maharashtra Skills Academy',
      district: 'Pune', address: 'IT Park, Hinjewadi, Pune', description: 'Premier skill development centre.',
    });

    const trainingUser2 = await User.create({
      name: 'Digital India Training Hub', email: 'training2@skillpulse.in',
      password: hashedPassword, role: 'training_centre', phone: '9876543221', district: 'Mumbai City',
    });
    const trainingCentre2 = await TrainingCentre.create({
      user: trainingUser2._id, centreName: 'Digital India Training Hub',
      district: 'Mumbai City', address: 'BKC, Mumbai', description: 'Government-affiliated training centre.',
    });

    // Employers
    const employer1 = await User.create({
      name: 'TechMaharashtra Solutions', email: 'demo.employer@skillpulse.in',
      password: hashedPassword, role: 'employer', phone: '9876543230', district: 'Pune',
    });
    await EmployerProfile.create({
      user: employer1._id, companyName: 'TechMaharashtra Solutions',
      industry: 'Information Technology', address: 'Kharadi, Pune',
      description: 'Leading IT solutions company in Maharashtra.', employeeCount: '500-1000',
    });

    const employer2 = await User.create({
      name: 'DataVision Analytics', email: 'employer2@skillpulse.in',
      password: hashedPassword, role: 'employer', phone: '9876543231', district: 'Mumbai City',
    });
    await EmployerProfile.create({
      user: employer2._id, companyName: 'DataVision Analytics',
      industry: 'Data Analytics', address: 'Lower Parel, Mumbai',
      description: 'Data-driven analytics firm.', employeeCount: '100-500',
    });

    const employer3 = await User.create({
      name: 'CloudFirst Technologies', email: 'employer3@skillpulse.in',
      password: hashedPassword, role: 'employer', phone: '9876543232', district: 'Nagpur',
    });
    await EmployerProfile.create({
      user: employer3._id, companyName: 'CloudFirst Technologies',
      industry: 'Cloud Services', address: 'MIHAN, Nagpur',
    });

    // Government Officer
    await User.create({
      name: 'Rajesh Pawar', email: 'demo.govt@skillpulse.in',
      password: hashedPassword, role: 'government', phone: '9876543240', district: 'Mumbai City',
    });

    // ============ TRAINING PROGRAMS ============
    console.log('📚 Creating training programs...');
    const programs = await TrainingProgram.create([
      {
        title: 'Full Stack Java Development', description: 'Comprehensive Java development program covering Spring Boot, SQL, and Git.',
        category: 'Programming', skillsCovered: ['Java', 'SQL', 'Spring Boot', 'Git'],
        duration: '3 months', mode: 'Hybrid', eligibility: "Bachelor's Degree", capacity: 50, enrolled: 25,
        startDate: new Date('2026-07-01'), endDate: new Date('2026-09-30'),
        centre: trainingCentre._id, createdBy: trainingUser._id, district: 'Pune', status: 'Active',
      },
      {
        title: 'Data Science with Python', description: 'Learn data analytics, machine learning, and data visualization.',
        category: 'Data Science', skillsCovered: ['Python', 'SQL', 'Data Analytics', 'Machine Learning'],
        duration: '4 months', mode: 'Online', eligibility: '12th Pass', capacity: 40, enrolled: 30,
        startDate: new Date('2026-06-15'), endDate: new Date('2026-10-15'),
        centre: trainingCentre._id, createdBy: trainingUser._id, district: 'Pune', status: 'Active',
      },
      {
        title: 'React & Node.js Web Development', description: 'Modern web development with JavaScript ecosystem.',
        category: 'Web Development', skillsCovered: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
        duration: '3 months', mode: 'Offline', eligibility: '12th Pass', capacity: 35, enrolled: 28,
        startDate: new Date('2026-08-01'), endDate: new Date('2026-10-31'),
        centre: trainingCentre2._id, createdBy: trainingUser2._id, district: 'Mumbai City', status: 'Active',
      },
      {
        title: 'Cloud Computing Fundamentals', description: 'AWS cloud services and DevOps practices.',
        category: 'Cloud Computing', skillsCovered: ['Cloud Computing', 'AWS', 'Docker', 'Linux', 'DevOps'],
        duration: '2 months', mode: 'Online', eligibility: "Bachelor's Degree", capacity: 45, enrolled: 20,
        startDate: new Date('2026-09-01'), endDate: new Date('2026-10-31'),
        centre: trainingCentre._id, createdBy: trainingUser._id, district: 'Pune', status: 'Active',
      },
      {
        title: 'Cyber Security Essentials', description: 'Network security, ethical hacking basics.',
        category: 'Cyber Security', skillsCovered: ['Cyber Security', 'Linux', 'Networking'],
        duration: '2 months', mode: 'Hybrid', eligibility: 'Diploma', capacity: 30, enrolled: 15,
        startDate: new Date('2026-07-15'), endDate: new Date('2026-09-15'),
        centre: trainingCentre2._id, createdBy: trainingUser2._id, district: 'Mumbai City', status: 'Active',
      },
    ]);

    // ============ ENROLLMENTS ============
    console.log('📝 Creating enrollments...');
    const enrollments = await Enrollment.create([
      { student: students[0]._id, program: programs[0]._id, status: 'Completed', progress: 100, attendance: 95, completedAt: new Date('2026-09-25') },
      { student: students[1]._id, program: programs[1]._id, status: 'In Progress', progress: 75, attendance: 88 },
      { student: students[2]._id, program: programs[2]._id, status: 'Completed', progress: 100, attendance: 92, completedAt: new Date('2026-10-28') },
      { student: students[3]._id, program: programs[2]._id, status: 'In Progress', progress: 40, attendance: 70 },
      { student: students[4]._id, program: programs[3]._id, status: 'Completed', progress: 100, attendance: 98, completedAt: new Date('2026-10-25') },
      { student: students[0]._id, program: programs[3]._id, status: 'Approved', progress: 10, attendance: 50 },
    ]);

    // ============ ASSESSMENTS ============
    console.log('📋 Creating assessments...');
    await Assessment.create([
      { enrollment: enrollments[0]._id, program: programs[0]._id, student: students[0]._id, title: 'Java Fundamentals Test', score: 85, maxScore: 100 },
      { enrollment: enrollments[0]._id, program: programs[0]._id, student: students[0]._id, title: 'Spring Boot Project', score: 78, maxScore: 100 },
      { enrollment: enrollments[2]._id, program: programs[2]._id, student: students[2]._id, title: 'React Capstone', score: 92, maxScore: 100 },
      { enrollment: enrollments[4]._id, program: programs[3]._id, student: students[4]._id, title: 'AWS Certification Prep', score: 88, maxScore: 100 },
    ]);

    // ============ CERTIFICATES ============
    console.log('🏆 Creating certificates...');
    await Certificate.create([
      { student: students[0]._id, program: programs[0]._id, centre: trainingCentre._id, skillsAcquired: ['Java', 'SQL', 'Spring Boot', 'Git'], grade: 'A' },
      { student: students[2]._id, program: programs[2]._id, centre: trainingCentre2._id, skillsAcquired: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'], grade: 'A+' },
      { student: students[4]._id, program: programs[3]._id, centre: trainingCentre._id, skillsAcquired: ['Cloud Computing', 'AWS', 'Docker', 'Linux', 'DevOps'], grade: 'A' },
    ]);

    // Update student profiles with new skills from training
    await StudentProfile.findOneAndUpdate(
      { user: students[0]._id },
      { skills: ['Java', 'HTML', 'CSS', 'SQL', 'Spring Boot', 'Git'], completedTrainings: 1, certificates: 1 }
    );
    await StudentProfile.findOneAndUpdate(
      { user: students[2]._id },
      { completedTrainings: 1, certificates: 1 }
    );
    await StudentProfile.findOneAndUpdate(
      { user: students[4]._id },
      { skills: ['Java', 'SQL', 'Spring Boot', 'Git', 'Cloud Computing', 'AWS', 'Docker', 'Linux', 'DevOps'], completedTrainings: 1, certificates: 1 }
    );

    // ============ JOBS ============
    console.log('💼 Creating jobs...');
    const jobs = await Job.create([
      {
        title: 'Software Developer', description: 'Build enterprise Java applications.',
        employer: employer1._id, companyName: 'TechMaharashtra Solutions',
        location: 'Kharadi, Pune', district: 'Pune', employmentType: 'Full Time',
        salaryRange: { min: 400000, max: 700000 }, experience: '0-2 years',
        requiredSkills: ['Java', 'SQL', 'Spring Boot', 'Git'], education: "Bachelor's Degree",
        deadline: new Date('2026-10-30'), status: 'Published', applicationsCount: 3,
      },
      {
        title: 'Data Analyst', description: 'Analyze business data and create insights.',
        employer: employer2._id, companyName: 'DataVision Analytics',
        location: 'Lower Parel, Mumbai', district: 'Mumbai City', employmentType: 'Full Time',
        salaryRange: { min: 500000, max: 900000 }, experience: '0-3 years',
        requiredSkills: ['Python', 'SQL', 'Data Analytics', 'Power BI', 'Machine Learning'],
        education: "Bachelor's Degree", deadline: new Date('2026-11-15'), status: 'Published',
      },
      {
        title: 'Full Stack Developer', description: 'Build modern web applications.',
        employer: employer1._id, companyName: 'TechMaharashtra Solutions',
        location: 'Kharadi, Pune', district: 'Pune', employmentType: 'Full Time',
        salaryRange: { min: 500000, max: 1000000 }, experience: '1-3 years',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'TypeScript'],
        education: "Bachelor's Degree", deadline: new Date('2026-11-30'), status: 'Published',
      },
      {
        title: 'Cloud Engineer', description: 'Manage cloud infrastructure.',
        employer: employer3._id, companyName: 'CloudFirst Technologies',
        location: 'MIHAN, Nagpur', district: 'Nagpur', employmentType: 'Full Time',
        salaryRange: { min: 600000, max: 1200000 }, experience: '1-4 years',
        requiredSkills: ['Cloud Computing', 'AWS', 'Docker', 'Linux', 'DevOps'],
        education: "Bachelor's Degree", deadline: new Date('2026-12-01'), status: 'Published',
      },
      {
        title: 'Cyber Security Analyst', description: 'Monitor and protect systems.',
        employer: employer2._id, companyName: 'DataVision Analytics',
        location: 'Lower Parel, Mumbai', district: 'Mumbai City', employmentType: 'Full Time',
        salaryRange: { min: 500000, max: 800000 }, experience: '0-2 years',
        requiredSkills: ['Cyber Security', 'Linux', 'Networking', 'Python'],
        education: "Bachelor's Degree", deadline: new Date('2026-11-30'), status: 'Published',
      },
      {
        title: 'Frontend Developer Intern', description: 'Build UI components.',
        employer: employer1._id, companyName: 'TechMaharashtra Solutions',
        location: 'Kharadi, Pune', district: 'Pune', employmentType: 'Internship',
        salaryRange: { min: 10000, max: 25000 }, experience: '0 years',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'], education: '12th Pass',
        deadline: new Date('2026-10-15'), status: 'Published',
      },
      {
        title: 'Python Developer', description: 'Develop backend services in Python.',
        employer: employer3._id, companyName: 'CloudFirst Technologies',
        location: 'MIHAN, Nagpur', district: 'Nagpur', employmentType: 'Full Time',
        salaryRange: { min: 450000, max: 800000 },
        requiredSkills: ['Python', 'SQL', 'Git', 'Docker'], education: "Bachelor's Degree",
        deadline: new Date('2026-11-15'), status: 'Published',
      },
    ]);

    // ============ JOB APPLICATIONS ============
    console.log('📩 Creating job applications...');
    await JobApplication.create([
      { student: students[0]._id, job: jobs[0]._id, status: 'Shortlisted', matchScore: 100, matchedSkills: ['Java', 'SQL', 'Spring Boot', 'Git'], missingSkills: [] },
      { student: students[4]._id, job: jobs[0]._id, status: 'Applied', matchScore: 75, matchedSkills: ['Java', 'SQL', 'Spring Boot', 'Git'], missingSkills: [] },
      { student: students[1]._id, job: jobs[1]._id, status: 'Applied', matchScore: 60, matchedSkills: ['Python', 'SQL', 'Data Analytics', 'Machine Learning'], missingSkills: ['Power BI'] },
      { student: students[2]._id, job: jobs[2]._id, status: 'Selected', matchScore: 83, matchedSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'], missingSkills: ['TypeScript'] },
      { student: students[4]._id, job: jobs[3]._id, status: 'Applied', matchScore: 100, matchedSkills: ['Cloud Computing', 'AWS', 'Docker', 'Linux', 'DevOps'], missingSkills: [] },
    ]);

    // ============ EMPLOYMENT ============
    console.log('🏢 Creating employment records...');
    await Employment.create([
      {
        student: students[2]._id, employer: employer1._id, job: jobs[2]._id,
        companyName: 'TechMaharashtra Solutions', jobTitle: 'Full Stack Developer',
        joiningDate: new Date('2026-09-01'), employmentType: 'Full Time', salary: 600000,
        district: 'Pune', status: 'Employer Verified', verifiedBy: employer1._id, verifiedAt: new Date(),
      },
      {
        student: students[0]._id, companyName: 'TechMaharashtra Solutions', jobTitle: 'Software Developer',
        joiningDate: new Date('2026-09-15'), employmentType: 'Full Time', salary: 500000,
        district: 'Pune', status: 'Self Reported',
      },
      {
        student: students[4]._id, companyName: 'CloudFirst Technologies', jobTitle: 'Cloud Engineer',
        joiningDate: new Date('2026-08-01'), employmentType: 'Full Time', salary: 800000,
        district: 'Nagpur', status: 'Government Verified', verifiedAt: new Date(),
      },
    ]);

    // ============ NOTIFICATIONS ============
    console.log('🔔 Creating notifications...');
    await Notification.create([
      { user: students[0]._id, type: 'job_recommendation', title: 'New Job Match', message: 'Software Developer at TechMaharashtra matches 100% of your skills!', link: '/student/jobs' },
      { user: students[0]._id, type: 'general', title: 'Certificate Issued', message: 'Your certificate for Full Stack Java Development has been issued.', link: '/student/certificates' },
      { user: students[2]._id, type: 'application_update', title: 'Application Selected!', message: 'Congratulations! You have been selected for Full Stack Developer at TechMaharashtra.', link: '/student/applications' },
      { user: employer1._id, type: 'new_application', title: 'New Application', message: 'Aarav Sharma applied for Software Developer with 100% match.', link: '/employer/jobs' },
    ]);

    console.log('\n✅ Seed completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Created:');
    console.log(`   • ${districtData.length} Districts`);
    console.log(`   • ${skillsData.length} Skills`);
    console.log(`   • ${students.length} Students`);
    console.log(`   • 2 Training Centres`);
    console.log(`   • 3 Employers`);
    console.log(`   • 1 Government Officer`);
    console.log(`   • ${programs.length} Training Programs`);
    console.log(`   • ${jobs.length} Jobs`);
    console.log(`   • 3 Employment Records`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔑 Demo Credentials (Password: Demo@123):');
    console.log('   Student:   demo.student@skillpulse.in');
    console.log('   Training:  demo.training@skillpulse.in');
    console.log('   Employer:  demo.employer@skillpulse.in');
    console.log('   Govt:      demo.govt@skillpulse.in');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedDB();
