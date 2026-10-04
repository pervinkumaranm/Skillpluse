import { useState, useEffect } from 'react';
import { jobService } from '../../services/dataService';
import { STATUS_COLORS, formatDate } from '../../utils/constants';
import { FileText, Clock } from 'lucide-react';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await jobService.getMyApplications();
        setApplications(res.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading applications...</p></div>;

  return (
    <div>
      <div className="page-header"><div><h1>My Applications</h1><p>Track all your job applications.</p></div></div>

      {applications.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Job</th><th>Company</th><th>Match</th><th>Status</th><th>Applied</th></tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td style={{ fontWeight: 600 }}>{app.job?.title || 'N/A'}</td>
                  <td>{app.job?.companyName || 'N/A'}</td>
                  <td><span className={`match-score ${app.matchScore >= 70 ? 'high' : app.matchScore >= 40 ? 'medium' : 'low'}`}>{app.matchScore}%</span></td>
                  <td><span className={`badge ${STATUS_COLORS[app.status] || 'badge-gray'}`}>{app.status}</span></td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{formatDate(app.appliedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3rem' }}>
          <FileText size={48} /><h3>No applications yet</h3><p>Browse jobs and start applying!</p>
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
