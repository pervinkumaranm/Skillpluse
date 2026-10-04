import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trainingService } from '../../services/dataService';
import { formatDate } from '../../utils/constants';
import {
  Users, Search, Filter, BookOpen, Award, FileText, CheckCircle, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const EnrolledStudents = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await trainingService.getPrograms();
      const courseList = res.data.data || [];
      setCourses(courseList);
      if (courseList.length > 0) {
        setSelectedCourseId(courseList[0]._id);
        loadStudents(courseList[0]._id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      toast.error('Failed to load courses');
      setLoading(false);
    }
  };

  const loadStudents = async (courseId) => {
    try {
      setLoading(true);
      const res = await trainingService.getEnrolledStudents(courseId);
      setStudents(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load enrolled students');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourseId(courseId);
    loadStudents(courseId);
  };

  const handleStatusChange = async (enrollmentId, newStatus) => {
    try {
      await trainingService.updateEnrollment(enrollmentId, { status: newStatus });
      toast.success('Status updated');
      setStudents((prev) =>
        prev.map((s) => (s._id === enrollmentId ? { ...s, status: newStatus } : s))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredStudents = students.filter((s) => {
    if (search && !s.student?.name?.toLowerCase().includes(search.toLowerCase()) && !s.student?.email?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Enrolled Students</h1>
          <p>Monitor student progress, attendance, and training outcomes across batches.</p>
        </div>
      </div>

      {/* Course Filter Selector Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ minWidth: '240px', flex: 1 }}>
            <label className="form-label" style={{ fontSize: '0.8125rem' }}>Select Course Batch</label>
            <select
              className="form-select"
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} ({c.district})
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: '240px', flex: 1 }}>
            <label className="form-label" style={{ fontSize: '0.8125rem' }}>Search Student</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input
                type="text"
                placeholder="Search by student name or email..."
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Student List Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div className="loading-spinner" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state" style={{ padding: '3.5rem' }}>
            <Users size={48} style={{ color: 'var(--gray-300)', margin: '0 auto 1rem' }} />
            <h3>No students enrolled in this course</h3>
            <p>Select another course batch or wait for candidates to apply.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>District</th>
                  <th>Enrollment Date</th>
                  <th>Curriculum Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((e) => (
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
                    <td>{formatDate(e.createdAt)}</td>
                    <td style={{ minWidth: '150px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{ width: `${e.progress || 0}%` }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{e.progress || 0}%</span>
                      </div>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}
                        value={e.status}
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
                        <Link
                          to={`/training/assessments?studentId=${e.student?._id}&enrollmentId=${e._id}`}
                          className="btn-secondary"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <FileText size={13} />
                          Assess
                        </Link>
                        {e.status === 'Completed' && (
                          <Link
                            to={`/training/certificates?enrollmentId=${e._id}`}
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

export default EnrolledStudents;
