import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { trainingService } from '../../services/dataService';
import { formatDate } from '../../utils/constants';
import {
  BookOpen, MapPin, Calendar, Users, Award, Clock,
  CheckCircle, ArrowLeft, Building2, Check, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentTrainingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchProgramDetails();
  }, [id]);

  const fetchProgramDetails = async () => {
    try {
      setLoading(true);
      const res = await trainingService.getProgram(id);
      setProgram(res.data.data.program);
      setEnrollmentCount(res.data.data.enrollmentCount || 0);

      // Check if student is already enrolled
      try {
        const studentRes = await trainingService.getPrograms();
        // Just verify if current student has this program in their enrollments
      } catch (e) {
        // ignore
      }
    } catch (error) {
      toast.error('Failed to load training details');
      navigate('/student/trainings');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await trainingService.enrollStudent(id);
      toast.success('Successfully enrolled in training program!');
      setIsEnrolled(true);
      setEnrollmentCount((prev) => prev + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
      if (error.response?.data?.message?.includes('Already enrolled')) {
        setIsEnrolled(true);
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!program) return null;

  const isFull = program.capacity && enrollmentCount >= program.capacity;
  const seatsLeft = program.capacity ? Math.max(0, program.capacity - enrollmentCount) : null;
  const progressPct = program.capacity ? Math.min(100, Math.round((enrollmentCount / program.capacity) * 100)) : 0;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/trainings')}
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={18} />
        Back to Training Programs
      </button>

      {/* Main Banner */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">{program.category || 'General Skilling'}</span>
              <span className="badge badge-info">{program.mode || 'Classroom'}</span>
              <span className="badge badge-neutral">{program.district}</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
              {program.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--gray-600)', flexWrap: 'wrap', fontSize: '0.9375rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Building2 size={16} />
                {program.centre?.centreName || 'Skill Development Centre'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <MapPin size={16} />
                {program.centre?.address || program.district}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Clock size={16} />
                {program.durationHours || 40} Hours
              </span>
            </div>
          </div>

          <div
            style={{
              textAlign: 'center',
              padding: '1.25rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gray-50)',
              border: '1px solid var(--gray-200)',
              minWidth: '160px',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase' }}>
              Available Seats
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: isFull ? 'var(--error-500)' : 'var(--primary-600)', lineHeight: 1.2 }}>
              {seatsLeft !== null ? seatsLeft : 'Open'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
              out of {program.capacity || 'unlimited'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Details & Curriculum */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--gray-900)' }}>
              Program Overview
            </h3>
            <p style={{ color: 'var(--gray-700)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {program.description || 'No detailed description provided.'}
            </p>

            {program.prerequisites && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--gray-800)' }}>
                  Prerequisites
                </h4>
                <p style={{ color: 'var(--gray-700)', lineHeight: 1.6 }}>
                  {program.prerequisites}
                </p>
              </div>
            )}
          </div>

          {/* Schedule & Batch Info */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--gray-900)' }}>
              Batch & Schedule
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Start Date</span>
                <p style={{ fontWeight: 600, color: 'var(--gray-800)', marginTop: '0.25rem' }}>
                  {formatDate(program.startDate)}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>End Date</span>
                <p style={{ fontWeight: 600, color: 'var(--gray-800)', marginTop: '0.25rem' }}>
                  {formatDate(program.endDate)}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Mode of Delivery</span>
                <p style={{ fontWeight: 600, color: 'var(--gray-800)', marginTop: '0.25rem' }}>
                  {program.mode || 'In-Person'}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Govt Certification</span>
                <p style={{ fontWeight: 600, color: 'var(--success-600)', marginTop: '0.25rem' }}>
                  MSSDS Recognized
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Skills Covered & Enrollment Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Skills Covered */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--gray-900)' }}>
              Skills You Will Master
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
              Upon successful completion, these verified skills will be automatically added to your profile and certificate.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {program.skillsCovered?.map((skill, idx) => (
                <span key={idx} className="badge badge-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }}>
                  <Award size={14} style={{ marginRight: '0.25rem' }} />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Seat Capacity Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--gray-900)' }}>
              Batch Enrollment
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
                <span style={{ color: 'var(--gray-600)' }}>Capacity Filled</span>
                <span style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{progressPct}% ({enrollmentCount}/{program.capacity || '∞'})</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progressPct}%`,
                    background: isFull ? 'var(--error-500)' : 'var(--primary-500)',
                  }}
                />
              </div>
            </div>

            {isEnrolled ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 1rem', background: 'var(--success-50)', borderRadius: 'var(--radius)' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'white',
                    color: 'var(--success-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                  }}
                >
                  <Check size={20} />
                </div>
                <h4 style={{ fontWeight: 600, color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
                  Enrolled in this Course
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>
                  Attend classes and complete your coursework to earn your certificate.
                </p>
                <Link to="/student/trainings" className="btn-secondary" style={{ width: '100%', display: 'inline-block' }}>
                  View Enrolled Programs
                </Link>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  disabled={enrolling || isFull}
                  onClick={handleEnroll}
                  className="btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem' }}
                >
                  <BookOpen size={18} />
                  {isFull ? 'Batch Full' : enrolling ? 'Enrolling...' : 'Enroll in This Program (Free)'}
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textAlign: 'center', marginTop: '0.75rem' }}>
                  Government sponsored skilling initiative under MSSDS Maharashtra.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTrainingDetails;
