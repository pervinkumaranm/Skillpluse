import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/dataService';
import { formatDate } from '../../utils/constants';
import {
  Briefcase, MapPin, Calendar, Users, ArrowLeft,
  CheckCircle, Trash2, Building2, Award, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Hired',
  'Rejected',
];

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobAndApplications();
  }, [id]);

  const loadJobAndApplications = async () => {
    try {
      setLoading(true);
      const [jobRes, appsRes] = await Promise.allSettled([
        jobService.getJob(id),
        jobService.getJobApplications(id),
      ]);

      if (jobRes.status === 'fulfilled') {
        setJob(jobRes.value.data.data?.job || jobRes.value.data.data);
      }
      if (appsRes.status === 'fulfilled') {
        setApplications(appsRes.value.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!job) return;
    const newStatus = job.status === 'Published' ? 'Closed' : 'Published';
    try {
      await jobService.updateJob(job._id, { status: newStatus });
      setJob((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Job status changed to ${newStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!job) return;
    if (!window.confirm(`Are you sure you want to delete "${job.title}"?`)) return;
    try {
      await jobService.deleteJob(job._id);
      toast.success('Job deleted successfully');
      navigate('/employer/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await jobService.updateApplicationStatus(appId, { status: newStatus });
      toast.success(`Application updated to "${newStatus}"`);
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update application');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3.5rem' }}>
        <Briefcase size={48} style={{ color: 'var(--gray-300)', margin: '0 auto 1rem' }} />
        <h3>Job not found</h3>
        <p>The requested job posting could not be found or has been removed.</p>
        <Link to="/employer/jobs" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Back to My Jobs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
            style={{ padding: '0.5rem' }}
            title="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1>{job.title}</h1>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={14} /> {job.companyName || 'Employer'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleToggleStatus}
            className="btn-secondary"
            style={{ fontSize: '0.875rem' }}
          >
            {job.status === 'Published' ? 'Close Job' : 'Publish Job'}
          </button>

          <button
            onClick={handleDelete}
            className="btn-ghost"
            style={{ color: 'var(--error-500)', padding: '0.5rem' }}
            title="Delete Job"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Job Overview Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span className={`badge ${job.status === 'Published' ? 'badge-success' : 'badge-neutral'}`}>
            {job.status}
          </span>
          <span className="badge badge-primary">{job.employmentType}</span>
          <span className="badge badge-info">{job.district}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--gray-100)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>Location</div>
            <div style={{ fontWeight: 600, color: 'var(--gray-800)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} /> {job.location || job.district}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>Posted Date</div>
            <div style={{ fontWeight: 600, color: 'var(--gray-800)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={14} /> {formatDate(job.createdAt)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>Applications</div>
            <div style={{ fontWeight: 600, color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Users size={14} /> {applications.length || job.applicationsCount || 0} Applicants
            </div>
          </div>
          {job.salaryRange && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>Salary Range</div>
              <div style={{ fontWeight: 600, color: 'var(--success-700)' }}>
                ₹{job.salaryRange.min?.toLocaleString()} - ₹{job.salaryRange.max?.toLocaleString()} / mo
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.5rem' }}>Job Description</h4>
          <p style={{ color: 'var(--gray-700)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            {job.description || 'No description provided.'}
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.5rem' }}>Required Skills</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {job.requiredSkills?.map((skill, idx) => (
              <span key={idx} className="skill-tag" style={{ fontSize: '0.8125rem', padding: '0.3rem 0.6rem' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Section for this Job */}
      <div className="card card-body">
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={18} style={{ color: 'var(--primary-600)' }} />
          Applicants for this Job ({applications.length})
        </h3>

        {applications.length === 0 ? (
          <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
            No candidates have applied for this job yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.map((app) => (
              <div
                key={app._id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius)',
                  background: 'var(--gray-50)',
                  border: '1px solid var(--gray-200)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--gray-900)' }}>
                      {app.student?.name || 'Applicant'}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                      {app.student?.email} • {app.student?.district || 'Maharashtra'} • Applied {formatDate(app.createdAt)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500 }}>Status:</span>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.8125rem', padding: '0.25rem 0.5rem', fontWeight: 600 }}
                      value={app.status}
                      onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {app.matchedSkills && app.matchedSkills.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success-700)' }}>Matched Skills:</span>
                    {app.matchedSkills.map((s, idx) => (
                      <span key={idx} className="badge badge-success" style={{ fontSize: '0.7rem' }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
