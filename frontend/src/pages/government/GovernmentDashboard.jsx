import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { governmentService } from '../../services/dataService';
import {
  Users, GraduationCap, Award, Briefcase, CheckCircle, TrendingUp,
  BookOpen, BarChart3, MapPin, Target, FileText, AlertCircle,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const CHART_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'];

const GovernmentDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [skillData, setSkillData] = useState(null);
  const [districtData, setDistrictData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [overviewRes, skillRes, districtRes] = await Promise.all([
          governmentService.getOverview(),
          governmentService.getSkillAnalytics(),
          governmentService.getDistrictAnalytics(),
        ]);
        setOverview(overviewRes.data.data);
        setSkillData(skillRes.data.data);
        setDistrictData(districtRes.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading analytics...</p></div>;

  const o = overview || {};

  const statCards = [
    { id: 'total-students', label: 'Total Students', value: o.totalStudents || 0, icon: Users, color: '#3b82f6', bg: '#eff6ff' },
    { id: 'training-centres', label: 'Training Centres', value: o.totalTrainingCentres || 0, icon: GraduationCap, color: '#f59e0b', bg: '#fffbeb' },
    { id: 'employers', label: 'Employers', value: o.totalEmployers || 0, icon: Briefcase, color: '#22c55e', bg: '#f0fdf4' },
    { id: 'enrolled', label: 'Enrolled', value: o.totalEnrollments || 0, icon: BookOpen, color: '#8b5cf6', bg: '#f5f3ff' },
    { id: 'completed-training', label: 'Completed Training', value: o.completedEnrollments || 0, icon: CheckCircle, color: '#06b6d4', bg: '#ecfeff' },
    { id: 'completion-rate', label: 'Completion Rate', value: `${o.trainingCompletionRate || 0}%`, icon: TrendingUp, color: '#14b8a6', bg: '#f0fdfa' },
    { id: 'certified', label: 'Certified', value: o.totalCertificates || 0, icon: Award, color: '#ec4899', bg: '#fdf2f8' },
    { id: 'employed', label: 'Employed', value: o.totalEmployment || 0, icon: Briefcase, color: '#f97316', bg: '#fff7ed' },
    { id: 'verified-employment', label: 'Verified Employment', value: o.verifiedEmployment || 0, icon: CheckCircle, color: '#22c55e', bg: '#f0fdf4' },
    { id: 'employment-rate', label: 'Employment Rate', value: `${o.employmentRate || 0}%`, icon: BarChart3, color: '#3b82f6', bg: '#eff6ff' },
    { id: 'active-programs', label: 'Active Programs', value: o.activePrograms || 0, icon: BookOpen, color: '#8b5cf6', bg: '#f5f3ff' },
    { id: 'active-jobs', label: 'Active Jobs', value: o.activeJobs || 0, icon: Target, color: '#ef4444', bg: '#fef2f2' },
  ];

  // Prepare chart data
  const skillChartData = skillData?.skillAnalytics?.slice(0, 10).map((s) => ({
    name: s.skill,
    demand: s.demand,
    supply: s.supply,
  })) || [];

  const districtChartData = districtData?.studentsByDistrict?.slice(0, 10).map((d) => ({
    name: d._id || 'Unknown',
    students: d.count,
  })) || [];

  const priorityGaps = skillData?.priorityGaps?.slice(0, 5) || [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Government Analytics Dashboard</h1>
          <p>Real-time overview of Maharashtra's skilling and employment ecosystem.</p>
        </div>
        <Link to="/government/reports" className="btn btn-primary"><FileText size={16} /> Export Reports</Link>
      </div>

      {/* Demo Data Label */}
      <div style={{
        background: 'var(--primary-50)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)',
        border: '1px solid var(--primary-100)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
        fontSize: '0.8125rem', color: 'var(--primary-700)', fontWeight: 500,
      }}>
        <AlertCircle size={16} /> All statistics shown below are from <strong>Demo Data</strong> for demonstration purposes.
      </div>

      {/* Stat Cards */}
      <div className="grid-stats" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="stat-card"
              onClick={() => navigate(`/government/details/${stat.id}`)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: 'translateY(0)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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
              <div className="stat-icon" style={{ background: stat.bg, width: '40px', height: '40px' }}>
                <Icon size={20} style={{ color: stat.color }} />
              </div>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Skill Demand vs Supply */}
        <div className="chart-card">
          <h3>Skill Demand vs Supply</h3>
          {skillChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="demand" fill="#3b82f6" name="Demand" radius={[4, 4, 0, 0]} />
                <Bar dataKey="supply" fill="#22c55e" name="Supply" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><p>No data available</p></div>}
        </div>

        {/* Students by District */}
        <div className="chart-card">
          <h3>Students by District (Top 10)</h3>
          {districtChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={districtChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="students" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><p>No data available</p></div>}
        </div>
      </div>

      {/* Priority Skill Gaps */}
      {priorityGaps.length > 0 && (
        <div className="card card-body" style={{ marginBottom: '1.5rem', borderLeft: '3px solid var(--error-500)' }}>
          <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} style={{ color: 'var(--error-500)' }} />
            Priority Skill Gaps
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
            Skills with high employer demand but low student availability. Government should prioritize training for these skills.
          </p>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead><tr><th>Skill</th><th>Demand</th><th>Supply</th><th>Gap</th></tr></thead>
              <tbody>
                {priorityGaps.map((gap, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{gap.skill}</td>
                    <td><span className="badge badge-red">{gap.demand} jobs</span></td>
                    <td><span className="badge badge-green">{gap.supply} students</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--error-600)' }}>{gap.demand - gap.supply}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="card card-body">
        <h4 style={{ marginBottom: '1rem' }}>Detailed Analytics</h4>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/government/districts" className="btn btn-secondary"><MapPin size={16} /> District Analytics</Link>
          <Link to="/government/skills" className="btn btn-secondary"><Target size={16} /> Skill Analytics</Link>
          <Link to="/government/training-effectiveness" className="btn btn-secondary"><GraduationCap size={16} /> Training Effectiveness</Link>
          <Link to="/government/employment" className="btn btn-secondary"><TrendingUp size={16} /> Employment Reports</Link>
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
