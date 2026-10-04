import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService } from '../../services/dataService';
import { getMatchScoreClass, formatDate, DISTRICTS } from '../../utils/constants';
import {
  Briefcase, MapPin, Building2, Calendar, DollarSign,
  GraduationCap, CheckCircle, AlertCircle, ArrowLeft, Send, Sparkles, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await jobService.getJob(id);
      setJob(res.data.data.job);
      setMatchResult(res.data.data.matchResult);

      // Check if user has already applied
      try {
        const appsRes = await jobService.getMyApplications();
        const existing = appsRes.data.data.find(
          (a) => a.job?._id === id || a.job === id
        );
        if (existing) setHasApplied(true);
      } catch (e) {
        // ignore
      }
    } catch (error) {
      toast.error('Failed to load job details');
      navigate('/student/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      setApplying(true);
      await jobService.applyForJob(id, { coverNote });
      toast.success('Application submitted successfully!');
      setHasApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/jobs')}
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={18} />
        Back to Jobs
      </button>

      {/* Main Header Banner */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">{job.employmentType}</span>
              <span className="badge badge-info">{job.district}</span>
              <span className={`badge ${job.status === 'Published' ? 'badge-success' : 'badge-neutral'}`}>
                {job.status}
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
              {job.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--gray-600)', flexWrap: 'wrap', fontSize: '0.9375rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Building2 size={16} />
                {job.companyName}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <MapPin size={16} />
                {job.location || job.district}
              </span>
              {job.salaryRange && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, color: 'var(--success-600)' }}>
                  <DollarSign size={16} />
                  ₹{job.salaryRange.min?.toLocaleString()} - ₹{job.salaryRange.max?.toLocaleString()} / mo
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Calendar size={16} />
                Posted {formatDate(job.createdAt)}
              </span>
            </div>
          </div>

          {/* Match Score Badge */}
          {matchResult && (
            <div
              style={{
                textAlign: 'center',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--gray-50), #f0fdf4)',
                border: '1px solid var(--success-200)',
                minWidth: '150px',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Skill Match
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--success-600)', lineHeight: 1.2 }}>
                {matchResult.matchScore}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                {matchResult.matchedSkills?.length || 0} of {job.requiredSkills?.length || 0} skills
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Job Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Description */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--gray-900)' }}>
              About the Role
            </h3>
            <p style={{ color: 'var(--gray-700)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {job.description || 'No detailed description provided.'}
            </p>

            {job.requirements && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--gray-800)' }}>
                  Requirements & Qualifications
                </h4>
                <p style={{ color: 'var(--gray-700)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {job.requirements}
                </p>
              </div>
            )}
          </div>

          {/* Job Overview Specs */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--gray-900)' }}>
              Role Overview
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Experience</span>
                <p style={{ fontWeight: 600, color: 'var(--gray-800)', marginTop: '0.25rem' }}>
                  {job.experienceLevel || 'Entry Level / Fresher'}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Education</span>
                <p style={{ fontWeight: 600, color: 'var(--gray-800)', marginTop: '0.25rem' }}>
                  {job.educationRequired || 'Any Graduate / Diploma'}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Openings</span>
                <p style={{ fontWeight: 600, color: 'var(--gray-800)', marginTop: '0.25rem' }}>
                  {job.openings || 1}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Total Applicants</span>
                <p style={{ fontWeight: 600, color: 'var(--gray-800)', marginTop: '0.25rem' }}>
                  {job.applicationsCount || 0} applied
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Skills & Application */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Skill Breakdown */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--gray-900)' }}>
              Required Skills
            </h3>

            {/* Matched Skills */}
            {matchResult?.matchedSkills?.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--success-600)', marginBottom: '0.5rem' }}>
                  <CheckCircle size={15} />
                  Skills You Have ({matchResult.matchedSkills.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {matchResult.matchedSkills.map((s, idx) => (
                    <span key={idx} className="badge badge-success" style={{ padding: '0.375rem 0.75rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {matchResult?.missingSkills?.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--warning-600)', marginBottom: '0.5rem' }}>
                  <AlertCircle size={15} />
                  Skills to Acquire ({matchResult.missingSkills.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {matchResult.missingSkills.map((s, idx) => (
                    <span key={idx} className="badge badge-warning" style={{ padding: '0.375rem 0.75rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <Link
                    to="/student/trainings"
                    style={{ fontSize: '0.8125rem', color: 'var(--primary-600)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Sparkles size={14} />
                    Find training programs for missing skills →
                  </Link>
                </div>
              </div>
            )}

            {/* If no match result (all skills list) */}
            {!matchResult && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {job.requiredSkills?.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Application Form */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--gray-900)' }}>
              Apply for Position
            </h3>

            {hasApplied ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--success-50)',
                    color: 'var(--success-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}
                >
                  <Check size={24} />
                </div>
                <h4 style={{ fontWeight: 600, color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
                  Application Submitted!
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '1.25rem' }}>
                  You have applied for this position. The employer has been notified.
                </p>
                <Link to="/student/applications" className="btn-secondary" style={{ display: 'inline-block' }}>
                  View All Applications
                </Link>
              </div>
            ) : (
              <form onSubmit={handleApply}>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontSize: '0.875rem' }}>
                    Cover Note / Message to Employer (Optional)
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Briefly explain why you are a great fit for this position..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={applying || job.status !== 'Published'}
                  className="btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Send size={18} />
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentJobDetails;
