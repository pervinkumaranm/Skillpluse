import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trainingService } from '../../services/dataService';
import { formatDate } from '../../utils/constants';
import {
  BookOpen, Plus, Search, Filter, Users, Calendar,
  CheckCircle, Clock, Trash2, ArrowRight, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const TrainingCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [statusFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await trainingService.getPrograms({
        status: statusFilter || undefined,
      });
      setCourses(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await trainingService.deleteProgram(id);
      toast.success('Course deleted successfully');
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const filteredCourses = courses.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalEnrollments = courses.reduce((acc, c) => acc + (c.enrolled || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>My Training Courses</h1>
          <p>Manage training programs, curricula, batch schedules, and student enrollment.</p>
        </div>
        <Link
          to="/training/courses/create"
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Create New Course
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 500 }}>Total Programs</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gray-900)', marginTop: '0.25rem' }}>
            {courses.length}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 500 }}>Active Batches</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-600)', marginTop: '0.25rem' }}>
            {courses.filter((c) => c.status === 'Active').length}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 500 }}>Total Enrolled Students</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success-600)', marginTop: '0.25rem' }}>
            {totalEnrollments}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input
              type="text"
              placeholder="Search courses by name or skill..."
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '160px' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3.5rem' }}>
          <BookOpen size={48} style={{ color: 'var(--gray-300)', margin: '0 auto 1rem' }} />
          <h3>No courses found</h3>
          <p>Get started by creating your first vocational training program.</p>
          <Link to="/training/courses/create" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            Create Course
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filteredCourses.map((course) => {
            const fillPct = course.capacity ? Math.round(((course.enrolled || 0) / course.capacity) * 100) : 0;
            return (
              <div key={course._id} className="card card-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">{course.category || 'General'}</span>
                  <span className={`badge ${course.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                    {course.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                  {course.title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '1rem', flex: 1, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.description}
                </p>

                {/* Meta details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--gray-600)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Clock size={15} />
                    <span>Duration: {course.durationHours || 40} Hours ({course.mode || 'Classroom'})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Calendar size={15} />
                    <span>Start: {formatDate(course.startDate)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Users size={15} />
                    <span>Enrolled: {course.enrolled || 0} / {course.capacity || '∞'} students ({fillPct}%)</span>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="progress-bar" style={{ marginBottom: '1.25rem' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${fillPct}%`,
                      background: fillPct >= 100 ? 'var(--error-500)' : 'var(--primary-500)',
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--gray-100)', paddingTop: '1rem', marginTop: 'auto' }}>
                  <Link
                    to={`/training/courses/${course._id}`}
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.875rem', fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    <Eye size={15} />
                    Manage Course
                  </Link>

                  <button
                    onClick={() => handleDelete(course._id, course.title)}
                    className="btn-ghost"
                    style={{ color: 'var(--error-500)', padding: '0.4rem' }}
                    title="Delete Course"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrainingCourses;
