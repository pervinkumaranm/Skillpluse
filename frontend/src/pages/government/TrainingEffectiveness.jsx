import { useState, useEffect } from 'react';
import { governmentService } from '../../services/dataService';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TrainingEffectiveness = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await governmentService.getTrainingEffectiveness();
        setData(res.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Analyzing training effectiveness...</p></div>;

  const chartData = data.map((d) => ({
    name: d.program.title.length > 20 ? d.program.title.substring(0, 20) + '...' : d.program.title,
    enrolled: d.metrics.enrolled,
    completed: d.metrics.completed,
    certified: d.metrics.certified,
    employed: d.metrics.employed,
  }));

  return (
    <div>
      <div className="page-header"><div><h1>Training Effectiveness</h1><p>Measure the real impact of each training program — from enrollment to employment.</p></div></div>

      <div style={{ background: 'var(--primary-50)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--primary-100)', marginBottom: '1.5rem', fontSize: '0.8125rem', color: 'var(--primary-700)' }}>
        <AlertCircle size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }} /> Demo Data
      </div>

      {chartData.length > 0 && (
        <div className="chart-card" style={{ marginBottom: '1.5rem' }}>
          <h3>Training Funnel (Enrolled → Completed → Certified → Employed)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="enrolled" fill="#3b82f6" name="Enrolled" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#22c55e" name="Completed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="certified" fill="#f59e0b" name="Certified" radius={[4, 4, 0, 0]} />
              <Bar dataKey="employed" fill="#8b5cf6" name="Employed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>Program</th><th>Centre</th><th>Enrolled</th><th>Completed</th><th>Certified</th><th>Employed</th><th>Completion %</th><th>Employment %</th></tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{item.program.title}</td>
                <td>{item.program.centre}</td>
                <td>{item.metrics.enrolled}</td>
                <td>{item.metrics.completed}</td>
                <td>{item.metrics.certified}</td>
                <td>{item.metrics.employed}</td>
                <td><span className={`badge ${item.metrics.completionRate >= 70 ? 'badge-green' : 'badge-yellow'}`}>{item.metrics.completionRate}%</span></td>
                <td><span className={`badge ${item.metrics.employmentRate >= 50 ? 'badge-green' : 'badge-yellow'}`}>{item.metrics.employmentRate}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainingEffectiveness;
