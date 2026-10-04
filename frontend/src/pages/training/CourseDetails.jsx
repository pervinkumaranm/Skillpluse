import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { trainingService } from '../../services/dataService';
import { formatDate } from '../../utils/constants';
import {
  BookOpen, Users, Calendar, Award, Clock, ArrowLeft,
  CheckCircle, Plus, Edit, FileText, Check, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadCourseAndStudents();
  }, [id]);

  const loadCourseAndStudents = async () => {
    try {
      setLoading(true);
      const [progRes, stuRes] = await Promise.all([
        trainingService.getProgram(id),
        trainingService.getEnrolledStudents(id),
      ]);
      setProgram(progRes.data.data.program);
      setStudents(stuRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load course details');
      navigate('/training/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (enrollmentId, newStatus) => {
    try {
      setUpdatingId(enrollmentId);
      await trainingService.updateEnrollment(enrollmentId, { status: newStatus });
      toast.success(`Enrollment status updated to ${newStatus}`);
      setStudents((prev) =>
        prev.map((s) => (s._id === enrollmentId ? { ...s, status: newStatus } : s))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleProgressChange = async (enrollmentId, newProgress) => {
    try {
      await trainingService.updateEnrollment(enrollmentId, { progress: Number(newProgress) });
      setStudents((prev) =>
        prev.map((s) => (s._id === enrollmentId ? { ...s, progress: Number(newProgress) } : s))
      );
      toast.success('Progress updated');
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!program) return null;

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate('/training/courses')}
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={18} />
        Back to Courses
      </button>

      {/* Course Header Banner */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">{program.category || 'Technical'}</span>
              <span className="badge badge-info">{program.mode || 'Classroom'}</span>
              <span className={`badge ${program.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                {program.status}
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
              {program.title}
            </h1>
            <p style={{ color: 'var(--gray-600)', maxWidth: '750px', lineHeight: 1.6, marginBottom: '1rem' }}>
              {program.description}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              <span><strong>Duration:</strong> {program.durationHours} Hours</span>
              <span><strong>Start Date:</strong> {formatDate(program.startDate)}</span>
              <span><strong>End Date:</strong> {formatDate(program.endDate)}</span>
              <span><strong>Capacity:</strong> {students.length} / {program.capacity || '∞'} Enrolled</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link
              to="/training/assessments"
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <FileText size={16} />
              Record Assessment
            </Link>
            <Link
              to="/training/certificates"
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <Award size={16} />
              Issue Certificates
            </Link>
          </div>
        </div>

        {/* Skills Tagged */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--gray-100)' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-700)', marginRight: '0.75rem' }}>
            Skills Imparted:
          </span>
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.375rem', verticalAlign: 'middle' }}>
            {program.skillsCovered?.map((s, idx) => (
              <span key={idx} className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Enrolled Students Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)' }}>
              Enrolled Students Roster ({students.length})
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
              Track student attendance, update completion status, and prepare for certification.
            </p>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="empty-state" style={{ padding: '3.5rem' }}>
            <Users size={40} style={{ color: 'var(--gray-300)', margin: '0 auto 1rem' }} />
            <h4>No students enrolled yet</h4>
            <p>Students from Maharashtra districts can browse and enroll in this course.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>District</th>
                  <th>Enrollment Date</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((e) => (
                  <tr key={e._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                        {e.student?.name || 'Student'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                        {e.student?.email}
                      </div>
                    </td>
                    <td>{e.student?.district || 'Maharashtra'}</td>
                    <td>{formatDate(e.enrolledAt || e.createdAt)}</td>
                    <td style={{ minWidth: '140px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={e.progress || 0}
                          onChange={(evt) => handleProgressChange(e._id, evt.target.value)}
                          style={{ width: '80px' }}
                        />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, minWidth: '32px' }}>
                          {e.progress || 0}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8125rem', minWidth: '130px' }}
                        value={e.status}
                        disabled={updatingId === e._id}
                        onChange={(evt) => handleStatusChange(e._id, evt.target.value)}
                      >
                        <option value="Enrolled">Enrolled</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Dropped">Dropped</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {e.status === 'Completed' && (
                          <Link
                            to={`/training/certificates?studentId=${e.student?._id}&enrollmentId=${e._id}`}
                            className="btn-primary"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <Award size={13} />
                            Certify
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
