import { useState, useEffect } from 'react';
import { employmentService } from '../../services/dataService';
import { STATUS_COLORS, formatDate } from '../../utils/constants';
import { Building2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentEmployment = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ companyName: '', jobTitle: '', joiningDate: '', employmentType: 'Full Time' });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await employmentService.getEmployment();
        setRecords(res.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await employmentService.reportEmployment(formData);
      toast.success('Employment reported!');
      setShowForm(false);
      const res = await employmentService.getEmployment();
      setRecords(res.data.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Employment</h1><p>Report and track your employment status.</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={16} /> Report Employment</button>
      </div>

      {showForm && (
        <div className="card card-body" style={{ marginBottom: '1.5rem', maxWidth: '600px' }}>
          <h4 style={{ marginBottom: '1rem' }}>Report Employment</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input className="form-input" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input className="form-input" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Joining Date</label>
              <input type="date" className="form-input" value={formData.joiningDate} onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {records.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Company</th><th>Job Title</th><th>Status</th><th>Joining Date</th></tr></thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: 600 }}>{r.companyName}</td>
                  <td>{r.jobTitle}</td>
                  <td><span className={`badge ${STATUS_COLORS[r.status] || 'badge-gray'}`}>{r.status}</span></td>
                  <td style={{ fontSize: '0.8125rem' }}>{formatDate(r.joiningDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !showForm && (
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3rem' }}>
          <Building2 size={48} /><h3>No employment records</h3><p>Report your employment to get it verified.</p>
        </div>
      )}
    </div>
  );
};

export default StudentEmployment;
