import { useState, useEffect } from 'react';
import { employmentService } from '../../services/dataService';
import { formatDate } from '../../utils/constants';
import {
  CheckCircle, XCircle, FileText, Building2, User,
  Calendar, DollarSign, ShieldAlert, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const EmploymentVerification = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    loadEmploymentRecords();
  }, []);

  const loadEmploymentRecords = async () => {
    try {
      setLoading(true);
      const res = await employmentService.getEmployment();
      setRecords(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load employment claims');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      setVerifyingId(id);
      const remarks = window.prompt(
        status === 'Employer_Verified'
          ? 'Enter optional verification remarks:'
          : 'Please enter reason for rejection:'
      );
      if (status === 'Rejected' && !remarks) {
        toast.error('Rejection remarks required');
        return;
      }

      await employmentService.verifyEmployment(id, { status, remarks });
      toast.success(status === 'Employer_Verified' ? 'Employment successfully verified!' : 'Claim marked as rejected.');

      setRecords((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update verification status');
    } finally {
      setVerifyingId(null);
    }
  };

  const pendingCount = records.filter(
    (r) => r.status === 'Self_Reported' || r.status === 'Pending_Verification'
  ).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Employment Verification Portal</h1>
          <p>Verify candidate employment records to establish authentic workforce outcome records in Maharashtra.</p>
        </div>
      </div>

      {/* Verification KPI banner */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--primary-50), #f0fdf4)', borderColor: 'var(--primary-200)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--primary-900)' }}>
              Official Industry Verification System
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--primary-800)', marginTop: '0.25rem' }}>
              Your verification officially validates employment claims for government skill tracking under SkillPulse Maharashtra.
            </p>
          </div>
          <span className="badge badge-warning" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
            {pendingCount} Pending Verification
          </span>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : records.length === 0 ? (
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3.5rem' }}>
          <CheckCircle size={48} style={{ color: 'var(--success-500)', margin: '0 auto 1rem' }} />
          <h3>No employment claims pending</h3>
          <p>When candidates report their hiring at your company, claims will appear here for your approval.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {records.map((rec) => {
            const isPending =
              rec.status === 'Self_Reported' || rec.status === 'Pending_Verification';
            return (
              <div
                key={rec._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)' }}>
                      {rec.student?.name || 'Trainee Graduate'}
                    </h3>
                    <span
                      className={`badge ${
                        rec.status.includes('VERIFIED')
                          ? 'badge-success'
                          : rec.status === 'REJECTED'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                    >
                      {rec.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                    Position: <strong>{rec.jobTitle}</strong> at <strong>{rec.companyName}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                    <span>Candidate Email: {rec.student?.email}</span>
                    <span>District: {rec.district || rec.student?.district || 'Maharashtra'}</span>
                    <span>Joined: {formatDate(rec.joiningDate)}</span>
                    {rec.salary && (
                      <span style={{ fontWeight: 600, color: 'var(--gray-700)' }}>
                        Reported: ₹{rec.salary.toLocaleString()}/mo
                      </span>
                    )}
                    {rec.proofDocument && (
                      <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                        ✓ Proof Document Uploaded
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {isPending ? (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleVerify(rec._id, 'Employer_Verified')}
                      disabled={verifyingId === rec._id}
                      className="btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                    >
                      <Check size={16} />
                      Verify Employment
                    </button>
                    <button
                      onClick={() => handleVerify(rec._id, 'Rejected')}
                      disabled={verifyingId === rec._id}
                      className="btn-ghost"
                      style={{ color: 'var(--error-500)', borderColor: 'var(--error-200)', border: '1px solid' }}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                      Decision recorded
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmploymentVerification;
