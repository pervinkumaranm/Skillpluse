import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trainingService } from '../../services/dataService';
import { formatDate } from '../../utils/constants';
import {
  Award, CheckCircle, Search, ExternalLink, ShieldCheck,
  Building2, Calendar, User, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const IssueCertificate = () => {
  const [searchParams] = useSearchParams();
  const preEnrollmentId = searchParams.get('enrollmentId');

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [completedEnrollments, setCompletedEnrollments] = useState([]);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(preEnrollmentId || '');
  const [grade, setGrade] = useState('A');
  const [issuing, setIssuing] = useState(false);
  const [issuedCertificates, setIssuedCertificates] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await trainingService.getPrograms();
      const list = res.data.data || [];
      setCourses(list);
      if (list.length > 0) {
        setSelectedCourseId(list[0]._id);
        loadEnrollments(list[0]._id);
      }
    } catch (error) {
      toast.error('Failed to load courses');
    }
  };

  const loadEnrollments = async (courseId) => {
    try {
      const res = await trainingService.getEnrolledStudents(courseId);
      // Filter students who are Completed
      const completed = (res.data.data || []).filter((e) => e.status === 'Completed');
      setCompletedEnrollments(completed);
      if (completed.length > 0 && !selectedEnrollmentId) {
        setSelectedEnrollmentId(completed[0]._id);
      }
    } catch (error) {
      toast.error('Failed to load completed students');
    }
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedEnrollmentId('');
    loadEnrollments(courseId);
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!selectedEnrollmentId) {
      toast.error('Please select a student who has completed the training');
      return;
    }

    try {
      setIssuing(true);
      const res = await trainingService.issueCertificate({
        enrollmentId: selectedEnrollmentId,
        grade,
      });
      toast.success('Digital Certificate issued successfully!');

      const cert = res.data.data;
      const enrolledObj = completedEnrollments.find((e) => e._id === selectedEnrollmentId);
      setIssuedCertificates((prev) => [
        {
          ...cert,
          studentName: enrolledObj?.student?.name,
          programTitle: courses.find((c) => c._id === selectedCourseId)?.title,
        },
        ...prev,
      ]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to issue certificate');
    } finally {
      setIssuing(false);
    }
  };

  const selectedEnrollment = completedEnrollments.find((e) => e._id === selectedEnrollmentId);
  const selectedCourse = courses.find((c) => c._id === selectedCourseId);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Issue Verifiable Certificates</h1>
          <p>Issue tamper-evident, QR-verifiable skill certificates to course graduates.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Certificate Issuance Form */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '1.25rem' }}>
            Issue New Certificate
          </h3>

          <form onSubmit={handleIssue}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Select Course Program</label>
              <select
                className="form-select"
                value={selectedCourseId}
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Eligible Graduate (Completed Status)</label>
              {completedEnrollments.length === 0 ? (
                <div style={{ padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--radius)', fontSize: '0.8125rem', color: 'var(--gray-600)' }}>
                  No students in this course currently have status "Completed". Update student status in the course roster first.
                </div>
              ) : (
                <select
                  className="form-select"
                  value={selectedEnrollmentId}
                  onChange={(e) => setSelectedEnrollmentId(e.target.value)}
                  required
                >
                  <option value="">-- Select Completed Student --</option>
                  {completedEnrollments.map((enr) => (
                    <option key={enr._id} value={enr._id}>
                      {enr.student?.name} ({enr.student?.district}) - Completed
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Performance Grade</label>
              <select
                className="form-select"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="A+">Grade A+ (Outstanding / 90%+)</option>
                <option value="A">Grade A (Excellent / 80-89%)</option>
                <option value="B+">Grade B+ (Very Good / 70-79%)</option>
                <option value="B">Grade B (Good / 60-69%)</option>
                <option value="Pass">Pass</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={issuing || completedEnrollments.length === 0 || !selectedEnrollmentId}
              className="btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem' }}
            >
              <Award size={18} />
              {issuing ? 'Generating Certificate...' : 'Issue Digital Certificate'}
            </button>
          </form>
        </div>

        {/* Certificate Preview Card */}
        <div
          className="card"
          style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, #f8fafc, #eff6ff)',
            border: '2px dashed var(--primary-300)',
            position: 'relative',
          }}
        >
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--primary-200)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary-700)', fontWeight: 700 }}>
              Government of Maharashtra
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--gray-900)', marginTop: '0.25rem' }}>
              Maharashtra State Skill Development Society
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
              Official Certificate of Competency
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>This certifies that</p>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--primary-800)' }}>
              {selectedEnrollment?.student?.name || 'Candidate Name'}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
              has successfully completed the prescribed curriculum in
            </p>
            <h4 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--gray-900)', marginTop: '0.25rem' }}>
              {selectedCourse?.title || 'Program Name'}
            </h4>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--gray-600)', borderTop: '1px solid var(--primary-200)', paddingTop: '0.75rem' }}>
            <div>
              <span>Grade Awarded: <strong>{grade}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success-700)', fontWeight: 600 }}>
              <ShieldCheck size={14} />
              Cryptographically Verified
            </div>
          </div>
        </div>
      </div>

      {/* Issued Certificates History */}
      {issuedCertificates.length > 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-100)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)' }}>
              Certificates Issued in This Session ({issuedCertificates.length})
            </h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Certificate ID</th>
                  <th>Student Name</th>
                  <th>Program</th>
                  <th>Grade</th>
                  <th>Issued Date</th>
                  <th>Verification</th>
                </tr>
              </thead>
              <tbody>
                {issuedCertificates.map((cert, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary-700)' }}>
                      {cert.certificateId}
                    </td>
                    <td style={{ fontWeight: 600 }}>{cert.studentName}</td>
                    <td>{cert.programTitle}</td>
                    <td><span className="badge badge-success">{cert.grade}</span></td>
                    <td>{formatDate(cert.issuedAt || new Date())}</td>
                    <td>
                      <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle size={12} /> Valid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueCertificate;
