import { useState, useEffect } from 'react';
import { governmentService } from '../../services/dataService';
import {
  Target, AlertTriangle, TrendingUp, Award,
  Sparkles, CheckCircle, BarChart3, HelpCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import toast from 'react-hot-toast';

const SkillAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillAnalytics();
  }, []);

  const fetchSkillAnalytics = async () => {
    try {
      setLoading(true);
      const res = await governmentService.getSkillAnalytics();
      setData(res.data.data);
    } catch (error) {
      toast.error('Failed to load skill analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  const skillAnalytics = data?.skillAnalytics || [
    { skill: 'React', demand: 18, supply: 9 },
    { skill: 'Node.js', demand: 16, supply: 7 },
    { skill: 'Python', demand: 15, supply: 10 },
    { skill: 'Machine Learning', demand: 14, supply: 4 },
    { skill: 'Cloud Computing (AWS)', demand: 12, supply: 5 },
    { skill: 'AutoCAD', demand: 11, supply: 6 },
    { skill: 'CNC Programming', demand: 10, supply: 3 },
    { skill: 'Data Analytics', demand: 14, supply: 8 },
    { skill: 'Electric Vehicle Maintenance', demand: 9, supply: 2 },
    { skill: 'Solar PV Installation', demand: 8, supply: 3 },
  ];

  const priorityGaps = data?.priorityGaps?.length > 0
    ? data.priorityGaps
    : skillAnalytics.filter((s) => s.demand > s.supply).sort((a, b) => (b.demand - b.supply) - (a.demand - a.supply));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Maharashtra Industry Skill Gap Analytics</h1>
          <p>Real-time telemetry measuring demand across employer job openings vs candidate skill supply in the state.</p>
        </div>
      </div>

      {/* Critical Insights Alert Banner */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
          border: '1px solid #fde68a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
          <AlertTriangle size={22} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#92400e', marginBottom: '0.25rem' }}>
              High-Deficit Skills Requiring Government Skilling Intervention
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#b45309', lineHeight: 1.5 }}>
              Market demand significantly outstrips candidate supply in <strong>Electric Vehicle Maintenance</strong>, <strong>CNC Programming</strong>, and <strong>Cloud Computing</strong>. Recommend directing vocational training subsidies towards these sectors.
            </p>
          </div>
        </div>
      </div>

      {/* Chart: Demand vs Supply */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '1.25rem' }}>
          Industry Skill Demand vs Trained Talent Supply
        </h3>
        <div style={{ height: '360px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillAnalytics.slice(0, 10)} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="skill" stroke="#64748b" fontSize={11} interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="demand" name="Employer Demand (Job Openings)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="supply" name="Candidate Talent Supply" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Skill Deficits Table */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)' }}>
              Priority Skill Gaps Requiring Capacity Addition
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
              Ordered by net gap deficit (Demand minus Supply).
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Employer Demand</th>
                <th>Talent Supply</th>
                <th>Net Deficit</th>
                <th>Deficit Severity</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {priorityGaps.map((item, idx) => {
                const gap = item.demand - item.supply;
                const ratio = item.demand > 0 ? (gap / item.demand) * 100 : 0;
                return (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                      {item.skill}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--warning-700)' }}>{item.demand} Openings</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary-700)' }}>{item.supply} Candidates</td>
                    <td style={{ fontWeight: 700, color: 'var(--error-600)' }}>-{gap}</td>
                    <td>
                      <span className={`badge ${ratio >= 60 ? 'badge-danger' : ratio >= 40 ? 'badge-warning' : 'badge-neutral'}`}>
                        {ratio >= 60 ? 'CRITICAL GAP' : ratio >= 40 ? 'MODERATE GAP' : 'BALANCED'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--gray-700)' }}>
                      {ratio >= 60 ? 'Approve 3+ new batches & MSSDS subsidy' : 'Expand intake by 25%'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SkillAnalytics;
