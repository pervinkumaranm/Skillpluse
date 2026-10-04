import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trainingService } from '../../services/dataService';
import { formatDate } from '../../utils/constants';
import {
  FileText, CheckCircle, Award, BookOpen, User, Plus, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const RecordAssessment = () => {
  const [searchParams] = useSearchParams();
  const preEnrollmentId = searchParams.get('enrollmentId');

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(preEnrollmentId || '');
  const [title, setTitle] = useState('Practical & Theory Assessment');
  const [score, setScore] = useState(85);
  const [maxScore, setMaxScore] = useState(100);
  const [remarks, setRemarks] = useState('Demonstrated strong practical understanding and skills competency.');
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);

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
      const enrs = res.data.data || [];
      setEnrollments(enrs);
      if (enrs.length > 0 && !selectedEnrollmentId) {
        setSelectedEnrollmentId(enrs[0]._id);
      }
    } catch (error) {
      toast.error('Failed to load students');
    }
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedEnrollmentId('');
    loadEnrollments(courseId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEnrollmentId) {
      toast.error('Please select an enrolled student');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        enrollmentId: selectedEnrollmentId,
        title,
        score: Number(score),
        maxScore: Number(maxScore),
        remarks,
      };
      const res = await trainingService.recordAssessment(payload);
      toast.success('Assessment scored and recorded successfully!');

      const studentObj = enrollments.find((e) => e._id === selectedEnrollmentId)?.student;
      setHistory((prev) => [
        {
          ...res.data.data,
          studentName: studentObj?.name || 'Student',
          recordedAt: new Date(),
        },
        ...prev,
      ]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1>Student Assessments</h1>
          <p>Record module test scores, practical evaluations, and grading feedback.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Assessment Entry Form */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '1.25rem' }}>
            Record New Assessment
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Course Batch</label>
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
              <label className="form-label">Student Candidate</label>
              <select
                className="form-select"
                value={selectedEnrollmentId}
                onChange={(e) => setSelectedEnrollmentId(e.target.value)}
                required
              >
                <option value="">-- Select Enrolled Student --</option>
                {enrollments.map((enr) => (
                  <option key={enr._id} value={enr._id}>
                    {enr.student?.name} ({enr.student?.email}) - Status: {enr.status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Assessment Title / Module</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mid-term Hands-on Assessment"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Score Obtained</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  max={maxScore}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Maximum Score</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Live percentage preview */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius)',
                background: pct >= 50 ? 'var(--success-50)' : 'var(--error-50)',
                marginBottom: '1rem',
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: pct >= 50 ? 'var(--success-700)' : 'var(--error-700)' }}>
                Result: {pct >= 50 ? 'PASS' : 'NEEDS IMPROVEMENT'}
              </span>
              <span style={{ fontSize: '1.125rem', fontWeight: 700, color: pct >= 50 ? 'var(--success-700)' : 'var(--error-700)' }}>
                {pct}%
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Evaluator Remarks / Feedback</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Candidate demonstrated excellence in..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Check size={18} />
              {submitting ? 'Saving Assessment...' : 'Record Assessment'}
            </button>
          </form>
        </div>

        {/* Recently Recorded Assessments */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '1rem' }}>
            Recently Recorded Scores
          </h3>

          {history.length === 0 ? (
            <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
              <FileText size={36} style={{ color: 'var(--gray-300)', margin: '0 auto 0.75rem' }} />
              <h4>No recent records in session</h4>
              <p style={{ fontSize: '0.8125rem' }}>Scores entered during this session will be listed here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.875rem',
                    borderRadius: 'var(--radius)',
                    background: 'var(--gray-50)',
                    border: '1px solid var(--gray-200)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                      {item.studentName}
                    </span>
                    <span className="badge badge-success">
                      {item.score} / {item.maxScore} ({Math.round((item.score / item.maxScore) * 100)}%)
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-600)' }}>
                    {item.title}
                  </div>
                  {item.remarks && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                      "{item.remarks}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordAssessment;
