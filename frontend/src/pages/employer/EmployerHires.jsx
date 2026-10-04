import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/dataService';
import { formatDate } from '../../utils/constants';
import { TrendingUp, Users, ArrowLeft, CheckCircle, Calendar, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployerHires = () => {
  const navigate = useNavigate();
  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHires();
  }, []);

  const loadHires = async () => {
    try {
      setLoading(true);
      const res = await jobService.getEmployerApplications();
      const apps = res.data.data || [];
      const hiredList = apps.filter(
        (a) => a.status === 'Hired' || a.status === 'Selected'
      );
      setHires(hiredList);
    } catch (error) {
      toast.error('Failed to load hires data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/employer/dashboard')}
            className="btn btn-secondary"
            style={{ padding: '0.5rem' }}
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1>Hires ({hires.length})</h1>
            <p>Track candidates successfully hired across your job requisitions.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : hires.length === 0 ? (
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3.5rem' }}>
          <TrendingUp size={48} style={{ color: 'var(--gray-300)', margin: '0 auto 1rem' }} />
          <h3>No hires yet</h3>
          <p>There are currently no candidates hired for your jobs.</p>
          <Link
            to="/employer/applications"
            className="btn-primary"
            style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Users size={16} /> Review Applications
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {hires.map((hire) => (
            <div key={hire._id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)' }}>
                      {hire.student?.name || 'Hired Candidate'}
                    </h3>
                    <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle size={12} /> Hired
                    </span>
                  </div>

                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-700)', marginBottom: '0.5rem' }}>
                    Job Role: {hire.job?.title || 'Position'}
                  </div>

                  <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                    <span>Email: {hire.student?.email}</span>
                    <span>District: {hire.student?.district || 'Maharashtra'}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> Hiring Date: {formatDate(hire.updatedAt || hire.createdAt)}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/employer/jobs/${hire.job?._id || hire.job}`}
                  className="btn-secondary"
                  style={{ fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Briefcase size={14} /> View Job
                </Link>
              </div>

              {hire.matchedSkills && hire.matchedSkills.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: '0.375rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-600)' }}>Candidate Skills:</span>
                  {hire.matchedSkills.map((skill, idx) => (
                    <span key={idx} className="badge badge-primary" style={{ fontSize: '0.75rem' }}>{skill}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerHires;
