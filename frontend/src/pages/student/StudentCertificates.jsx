import { useState, useEffect } from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { formatDate } from '../../utils/constants';
import api from '../../services/api';

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/students/profile');
        // Get certificates through profile; certificates are linked through enrolled programs
        const certRes = await api.get('/trainings', { params: { limit: 50 } });
        // For demo we'll show a simple view
        setCertificates([]);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading certificates...</p></div>;

  return (
    <div>
      <div className="page-header"><div><h1>My Certificates</h1><p>View certificates earned through training programs.</p></div></div>
      <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3rem' }}>
        <Award size={48} /><h3>No certificates yet</h3><p>Complete training programs to earn certificates.</p>
      </div>
    </div>
  );
};

export default StudentCertificates;
