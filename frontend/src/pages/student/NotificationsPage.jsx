import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/dataService';
import { formatDate } from '../../utils/constants';
import {
  Bell, CheckCheck, Trash2, ExternalLink, Briefcase,
  BookOpen, Award, CheckCircle, Info, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      const list = res.data.data?.notifications || res.data.data || [];
      setNotifications(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id, link) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true, isRead: true } : n))
      );
      if (link) navigate(link);
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Notification removed');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const isItemRead = (n) => Boolean(n.read || n.isRead);

  const filteredNotifications = Array.isArray(notifications)
    ? notifications.filter((n) => {
        if (filter === 'unread') return !isItemRead(n);
        return true;
      })
    : [];

  const getIcon = (type) => {
    switch (type) {
      case 'new_application':
      case 'application_update':
        return <Briefcase size={18} color="var(--primary-600)" />;
      case 'new_enrollment':
      case 'enrollment_update':
        return <BookOpen size={18} color="var(--info-500)" />;
      case 'general':
      case 'certificate':
        return <Award size={18} color="var(--warning-600)" />;
      case 'employment_verification':
        return <CheckCircle size={18} color="var(--success-600)" />;
      default:
        return <Bell size={18} color="var(--gray-500)" />;
    }
  };

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !isItemRead(n)).length
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Notifications Center</h1>
          <p>Stay updated on applications, training courses, and verified credentials.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <CheckCheck size={18} />
              Mark All as Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--gray-100)',
              color: 'var(--gray-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Bell size={28} />
          </div>
          <h3>No notifications found</h3>
          <p>You are all caught up! New updates regarding your courses and jobs will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredNotifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleMarkRead(n._id, n.link)}
              className="card"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                cursor: 'pointer',
                background: n.isRead ? 'white' : 'var(--primary-50)',
                borderLeft: n.isRead ? '4px solid transparent' : '4px solid var(--primary-500)',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius)',
                  background: 'white',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {getIcon(n.type)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: n.isRead ? 600 : 700, color: 'var(--gray-900)' }}>
                    {n.title}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>
                    {formatDate(n.createdAt)}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                  {n.message}
                </p>
                {n.link && (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--primary-600)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    View details <ExternalLink size={12} />
                  </span>
                )}
              </div>

              <button
                onClick={(e) => handleDelete(e, n._id)}
                className="btn-ghost"
                style={{ color: 'var(--gray-400)', padding: '0.375rem' }}
                title="Delete notification"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
