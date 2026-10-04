import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/dataService';
import { formatDate } from '../../utils/constants';
import {
  Users, CheckCircle, Clock, XCircle, Briefcase,
  Search, Filter, ArrowLeft, MessageSquare, Award
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

const JobApplications = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preJobId = searchParams.get('jobId') || '';

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(preJobId);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadJobsAndApplications();
  }, []);

  const loadJobsAndApplications = async () => {
    try {
      setLoading(true);
      const jobsRes = await jobService.getMyJobs();
      const list = jobsRes.data.data || [];
      setJobs(list);

      if (preJobId) {
        setSelectedJobId(preJobId);
        const appRes = await jobService.getJobApplications(preJobId);
        setApplications(appRes.data.data || []);
      } else {
        const appRes = await jobService.getEmployerApplications();
        setApplications(appRes.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleJobChange = async (jobId) => {
    setSelectedJobId(jobId);
    setLoading(true);
    try {
      if (!jobId) {
        const res = await jobService.getEmployerApplications();
        setApplications(res.data.data || []);
      } else {
        const res = await jobService.getJobApplications(jobId);
        setApplications(res.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to load applications for selected job');
    } finally {
      setLoading(false);
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

  const filteredApplications = applications.filter((app) => {
    if (statusFilter && app.status !== statusFilter) return false;
    return true;
  });

  const getMatchScoreBadge = (score) => {
    if (score >= 80) return <span className="badge badge-success">{score}% Match</span>;
    if (score >= 50) return <span className="badge badge-warning">{score}% Match</span>;
    return <span className="badge badge-neutral">{score}% Match</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/employer/dashboard')}
            className="btn btn-secondary"
            style={{ padding: '0.5rem' }}
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1>Candidate Applications</h1>
            <p>Review candidate profiles, match scores, and progress hiring status.</p>
          </div>
        </div>
      </div>

      {/* Selector Filters */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ minWidth: '260px', flex: 1 }}>
            <label className="form-label" style={{ fontSize: '0.8125rem' }}>Select Job Requisition</label>
            <select
              className="form-select"
              value={selectedJobId}
              onChange={(e) => handleJobChange(e.target.value)}
            >
              <option value="">All Job Requisitions</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title} ({j.applicationsCount || 0} applicants) - {j.status}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: '180px' }}>
            <label className="form-label" style={{ fontSize: '0.8125rem' }}>Filter by Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3.5rem' }}>
          <Users size={48} style={{ color: 'var(--gray-300)', margin: '0 auto 1rem' }} />
          <h3>No applications found</h3>
          <p>No candidates have applied for this filter criteria yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredApplications.map((app) => (
            <div key={app._id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)' }}>
                      {app.student?.name || 'Applicant'}
                    </h3>
                    {getMatchScoreBadge(app.matchScore || 0)}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', display: 'flex', gap: '1rem' }}>
                    <span>{app.student?.email}</span>
                    <span>District: {app.student?.district || 'Maharashtra'}</span>
                    <span>Applied: {formatDate(app.createdAt)}</span>
                  </div>
                </div>

                {/* Status Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 500 }}>Status:</span>
                  <select
                    className="form-select"
                    style={{ minWidth: '170px', fontWeight: 600 }}
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cover note */}
              {app.coverNote && (
                <div style={{ padding: '0.75rem 1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                  <strong>Applicant Note:</strong> "{app.coverNote}"
                </div>
              )}

              {/* Skills matched vs missing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--gray-100)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success-700)', textTransform: 'uppercase' }}>
                    Matched Skills ({app.matchedSkills?.length || 0})
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.375rem' }}>
                    {app.matchedSkills?.length > 0 ? (
                      app.matchedSkills.map((s, idx) => (
                        <span key={idx} className="badge badge-success" style={{ fontSize: '0.75rem' }}>{s}</span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>None recorded</span>
                    )}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--warning-700)', textTransform: 'uppercase' }}>
                    Missing Skills ({app.missingSkills?.length || 0})
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.375rem' }}>
                    {app.missingSkills?.length > 0 ? (
                      app.missingSkills.map((s, idx) => (
                        <span key={idx} className="badge badge-warning" style={{ fontSize: '0.75rem' }}>{s}</span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--success-600)' }}>100% Match!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
