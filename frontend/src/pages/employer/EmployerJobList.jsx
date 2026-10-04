import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { jobService } from '../../services/dataService';
import { formatDate } from '../../utils/constants';
import {
  Briefcase, Plus, MapPin, Calendar, Trash2,
  ArrowLeft, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const EmployerJobList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status') || '';
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getMyJobs();
      setJobs(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load posted jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Published' ? 'Closed' : 'Published';
    try {
      await jobService.updateJob(id, { status: newStatus });
      setJobs((prev) =>
        prev.map((j) => (j._id === id ? { ...j, status: newStatus } : j))
      );
      toast.success(`Job status changed to ${newStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the job posting "${title}"?`)) return;
    try {
      await jobService.deleteJob(id);
      toast.success('Job posting deleted');
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const filteredJobs = statusParam
    ? jobs.filter((j) => j.status?.toLowerCase() === statusParam.toLowerCase())
    : jobs;

  const publishedCount = jobs.filter((j) => j.status === 'Published').length;
  const closedCount = jobs.filter((j) => j.status === 'Closed').length;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/employer/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Back to Dashboard">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1>{statusParam === 'Published' ? 'Published Jobs' : 'My Job Postings'}</h1>
            <p>Manage open requisitions, review candidate applications, and track hiring progress.</p>
          </div>
        </div>
        <Link
          to="/employer/jobs/create"
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Post New Job
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          className={`btn ${!statusParam ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSearchParams({})}
          style={{ fontSize: '0.8125rem', padding: '0.4rem 0.85rem' }}
        >
          All Jobs ({jobs.length})
        </button>
        <button
          className={`btn ${statusParam === 'Published' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSearchParams({ status: 'Published' })}
          style={{ fontSize: '0.8125rem', padding: '0.4rem 0.85rem' }}
        >
          Published ({publishedCount})
        </button>
        {closedCount > 0 && (
          <button
            className={`btn ${statusParam === 'Closed' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSearchParams({ status: 'Closed' })}
            style={{ fontSize: '0.8125rem', padding: '0.4rem 0.85rem' }}
          >
            Closed ({closedCount})
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3.5rem' }}>
          <Briefcase size={48} style={{ color: 'var(--gray-300)', margin: '0 auto 1rem' }} />
          <h3>{statusParam === 'Published' ? 'No published jobs found' : 'No job postings yet'}</h3>
          <p>{statusParam === 'Published' ? 'There are currently no active published jobs.' : 'Create your first job requisition to start matching with verified skilled talent.'}</p>
          <Link
            to="/employer/jobs/create"
            className="btn-primary"
            style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} />
            Post a Job
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.25rem',
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                  <span className={`badge ${job.status === 'Published' ? 'badge-success' : 'badge-neutral'}`}>
                    {job.status}
                  </span>
                  <span className="badge badge-primary">{job.employmentType}</span>
                  <span className="badge badge-info">{job.district}</span>
                </div>

                <Link
                  to={`/employer/jobs/${job._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {job.title}
                    <Eye size={16} style={{ color: 'var(--primary-600)' }} />
                  </h3>
                </Link>

                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--gray-600)', marginBottom: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={14} /> {job.location || job.district}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} /> Posted {formatDate(job.createdAt)}
                  </span>
                  {job.salaryRange && (
                    <span style={{ fontWeight: 600, color: 'var(--success-700)' }}>
                      ₹{job.salaryRange.min?.toLocaleString()} - ₹{job.salaryRange.max?.toLocaleString()} / mo
                    </span>
                  )}
                </div>

                {/* Skill badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {job.requiredSkills?.map((skill, idx) => (
                    <span key={idx} className="skill-tag" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Application Counter and Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to={`/employer/applications?jobId=${job._id}`}
                  className="card"
                  style={{
                    padding: '0.75rem 1.25rem',
                    textAlign: 'center',
                    background: 'var(--primary-50)',
                    borderColor: 'var(--primary-200)',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                    {job.applicationsCount || 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-800)', fontWeight: 500 }}>
                    Applicants
                  </div>
                </Link>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Link
                    to={`/employer/jobs/${job._id}`}
                    className="btn-secondary"
                    style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Eye size={14} /> View
                  </Link>

                  <button
                    onClick={() => handleToggleStatus(job._id, job.status)}
                    className="btn-secondary"
                    style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }}
                  >
                    {job.status === 'Published' ? 'Close Job' : 'Publish'}
                  </button>

                  <button
                    onClick={() => handleDelete(job._id, job.title)}
                    className="btn-ghost"
                    style={{ color: 'var(--error-500)', padding: '0.5rem' }}
                    title="Delete Job"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerJobList;

