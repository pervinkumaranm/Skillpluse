import { useState } from 'react';
import { governmentService } from '../../services/dataService';
import { FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [downloading, setDownloading] = useState(null);

  const reports = [
    { type: 'employment', title: 'Employment Report', desc: 'All employment records with verification status', icon: '📋' },
    { type: 'training', title: 'Training Effectiveness Report', desc: 'Program-wise enrollment, completion, and placement metrics', icon: '📊' },
    { type: 'skills', title: 'Skill Analytics Report', desc: 'Skill demand vs supply analysis with gap identification', icon: '🎯' },
  ];

  const handleExport = async (type) => {
    setDownloading(type);
    try {
      const res = await governmentService.exportReport(type);
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded!');
    } catch (err) { toast.error('Failed to export'); }
    finally { setDownloading(null); }
  };

  return (
    <div>
      <div className="page-header"><div><h1>Export Reports</h1><p>Download CSV reports for analysis.</p></div></div>
      <div className="grid-cards" style={{ maxWidth: '800px' }}>
        {reports.map((r) => (
          <div key={r.type} className="card card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1rem' }}>{r.title}</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{r.desc}</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => handleExport(r.type)} disabled={downloading === r.type}>
              {downloading === r.type ? <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div> : <><Download size={14} /> CSV</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
