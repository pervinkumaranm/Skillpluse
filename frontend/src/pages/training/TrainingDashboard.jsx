import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trainingService } from '../../services/dataService';
import { BookOpen, Users, Award, TrendingUp, Plus, AlertCircle } from 'lucide-react';

const TrainingDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await trainingService.getDashboard();
        setData(res.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading dashboard...</p></div>;

  const stats = data?.stats || {};

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Training Centre Dashboard</h1>
          <p>{data?.centre?.centreName || 'Welcome to your dashboard'}</p>
        </div>
        <Link to="/training/courses/create" className="btn btn-primary"><Plus size={16} /> Create Course</Link>
      </div>

      <div className="grid-stats">
        {[
          { label: 'Total Programs', value: stats.totalPrograms || 0, icon: BookOpen, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Active Programs', value: stats.activePrograms || 0, icon: BookOpen, color: '#22c55e', bg: '#f0fdf4' },
          { label: 'Total Enrollments', value: stats.totalEnrollments || 0, icon: Users, color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Completed', value: stats.completedEnrollments || 0, icon: TrendingUp, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Completion Rate', value: `${stats.completionRate || 0}%`, icon: TrendingUp, color: '#06b6d4', bg: '#ecfeff' },
          { label: 'Certificates Issued', value: stats.totalCertificates || 0, icon: Award, color: '#ef4444', bg: '#fef2f2' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ background: stat.bg }}><Icon size={22} style={{ color: stat.color }} /></div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="card card-body">
        <h4 style={{ marginBottom: '1rem' }}>Quick Actions</h4>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/training/courses/create" className="btn btn-primary"><Plus size={16} /> New Course</Link>
          <Link to="/training/courses" className="btn btn-secondary">View Courses</Link>
          <Link to="/training/students" className="btn btn-secondary">View Students</Link>
          <Link to="/training/certificates" className="btn btn-secondary">Issue Certificates</Link>
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;
