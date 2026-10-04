import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/dataService';
import { getMatchScoreClass, STATUS_COLORS } from '../../utils/constants';
import {
  Target, BookOpen, Award, Briefcase, TrendingUp, CheckCircle,
  ArrowRight, User, AlertCircle,
} from 'lucide-react';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await studentService.getProfile();
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading dashboard...</p></div>;
  if (error) return <div className="empty-state"><AlertCircle size={48} /><h3>Error</h3><p>{error}</p></div>;

  const { user, profile, stats } = data;

  const statCards = [
    { label: 'Profile Completion', value: `${profile?.profileCompletion || 0}%`, icon: User, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Skills', value: profile?.skills?.length || 0, icon: Target, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Trainings Enrolled', value: stats?.enrollments || 0, icon: BookOpen, color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Completed', value: stats?.completedTrainings || 0, icon: CheckCircle, color: '#22c55e', bg: '#f0fdf4' },
    { label: 'Certificates', value: stats?.certificates || 0, icon: Award, color: '#ef4444', bg: '#fef2f2' },
    { label: 'Employment', value: stats?.isEmployed ? 'Employed' : 'Seeking', icon: Briefcase, color: '#06b6d4', bg: '#ecfeff' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>Here's your skills and career overview.</p>
        </div>
        <Link to="/student/profile" className="btn btn-secondary">
          <User size={16} /> Edit Profile
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid-stats">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ background: stat.bg }}>
                <Icon size={22} style={{ color: stat.color }} />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Profile Progress + Skills */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Profile Completion */}
        <div className="card card-body">
          <h4 style={{ marginBottom: '1rem' }}>Profile Completion</h4>
          <div className="progress-bar" style={{ height: '12px', marginBottom: '0.5rem' }}>
            <div className="progress-fill" style={{ width: `${profile?.profileCompletion || 0}%` }}></div>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
            {profile?.profileCompletion < 100
              ? 'Complete your profile to get better job matches.'
              : 'Your profile is complete! ✅'}
          </p>
          <Link to="/student/profile" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Update Profile <ArrowRight size={14} />
          </Link>
        </div>

        {/* Current Skills */}
        <div className="card card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4>My Skills</h4>
            <Link to="/student/skills" className="btn btn-ghost btn-sm">Manage</Link>
          </div>
          {profile?.skills?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {profile.skills.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <Target size={32} />
              <p style={{ fontSize: '0.8125rem' }}>No skills added yet</p>
              <Link to="/student/skills" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                Add Skills
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card card-body">
        <h4 style={{ marginBottom: '1rem' }}>Quick Actions</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            { to: '/student/skill-gap', label: 'View Skill Gap', icon: TrendingUp, color: '#3b82f6' },
            { to: '/student/trainings', label: 'Browse Trainings', icon: BookOpen, color: '#f59e0b' },
            { to: '/student/jobs', label: 'Find Jobs', icon: Briefcase, color: '#22c55e' },
            { to: '/student/applications', label: 'My Applications', icon: CheckCircle, color: '#8b5cf6' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={i} to={action.to} className="card" style={{
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius)',
                  background: `${action.color}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} style={{ color: action.color }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{action.label}</div>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--gray-300)', marginLeft: 'auto' }} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
