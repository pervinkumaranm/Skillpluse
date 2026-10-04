import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Users, CheckCircle, Plus, Search, TrendingUp } from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.allSettled([
          jobService.getMyJobs(),
          jobService.getEmployerApplications(),
        ]);
        if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value.data.data || []);
        if (appsRes.status === 'fulfilled') setApplications(appsRes.value.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading dashboard...</p></div>;

  const totalAppsCount = applications.length > 0 
    ? applications.length 
    : jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);
  const publishedJobsCount = jobs.filter((j) => j.status === 'Published').length;
  const hiresCount = applications.filter((a) => a.status === 'Hired' || a.status === 'Selected').length;

  const statCards = [
    { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: '#3b82f6', bg: '#eff6ff', path: '/employer/jobs' },
    { label: 'Published', value: publishedJobsCount, icon: CheckCircle, color: '#22c55e', bg: '#f0fdf4', path: '/employer/jobs?status=Published' },
    { label: 'Applications', value: totalAppsCount, icon: Users, color: '#8b5cf6', bg: '#f5f3ff', path: '/employer/applications' },
    { label: 'Hires', value: hiresCount, icon: TrendingUp, color: '#f59e0b', bg: '#fffbeb', path: '/employer/hires' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Employer Dashboard</h1>
          <p>Manage jobs, find candidates, and verify employment.</p>
        </div>
        <Link to="/employer/jobs/create" className="btn btn-primary"><Plus size={16} /> Post Job</Link>
      </div>

      <div className="grid-stats">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="stat-card"
              onClick={() => navigate(stat.path)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: 'translateY(0)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = 'var(--primary-300)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = 'var(--gray-200)';
              }}
            >
              <div className="stat-icon" style={{ background: stat.bg }}>
                <Icon size={22} style={{ color: stat.color }} />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid-2">
        <div className="card card-body">
          <h4 style={{ marginBottom: '1rem' }}>Recent Jobs</h4>
          {jobs.length > 0 ? jobs.slice(0, 5).map((job) => (
            <Link
              key={job._id}
              to={`/employer/jobs/${job._id}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--gray-100)',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{job.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{job.applicationsCount || 0} applications</div>
              </div>
              <span className={`badge ${job.status === 'Published' ? 'badge-green' : 'badge-gray'}`}>{job.status}</span>
            </Link>
          )) : <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>No jobs posted yet.</p>}
        </div>

        <div className="card card-body">
          <h4 style={{ marginBottom: '1rem' }}>Quick Actions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/employer/jobs/create" className="btn btn-primary"><Plus size={16} /> Post a Job</Link>
            <Link to="/employer/candidates" className="btn btn-secondary"><Search size={16} /> Find Candidates</Link>
            <Link to="/employer/employment-verification" className="btn btn-secondary"><CheckCircle size={16} /> Verify Employment</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;

