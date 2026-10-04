import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, User, BookOpen, Briefcase, Award, FileText,
  BarChart3, Building2, Users, ClipboardCheck, TrendingUp,
  GraduationCap, Target, MapPin, Bell, LogOut, Menu, X, ChevronRight,
  Shield, Settings, Search, CheckCircle,
} from 'lucide-react';

const sidebarConfig = {
  student: {
    title: 'Student',
    links: [
      { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/student/profile', label: 'My Profile', icon: User },
      { to: '/student/skills', label: 'Skills', icon: Target },
      { to: '/student/skill-gap', label: 'Skill Gap', icon: TrendingUp },
      { section: 'Learning' },
      { to: '/student/trainings', label: 'Training Programs', icon: BookOpen },
      { to: '/student/certificates', label: 'Certificates', icon: Award },
      { section: 'Career' },
      { to: '/student/jobs', label: 'Browse Jobs', icon: Briefcase },
      { to: '/student/applications', label: 'Applications', icon: FileText },
      { to: '/student/employment', label: 'Employment', icon: Building2 },
      { section: 'Other' },
      { to: '/student/notifications', label: 'Notifications', icon: Bell },
    ],
  },
  training_centre: {
    title: 'Training Centre',
    links: [
      { to: '/training/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/training/courses', label: 'My Courses', icon: BookOpen },
      { to: '/training/courses/create', label: 'Create Course', icon: ClipboardCheck },
      { section: 'Management' },
      { to: '/training/students', label: 'Students', icon: Users },
      { to: '/training/assessments', label: 'Assessments', icon: FileText },
      { to: '/training/certificates', label: 'Certificates', icon: Award },
      { to: '/training/placements', label: 'Placements', icon: TrendingUp },
    ],
  },
  employer: {
    title: 'Employer',
    links: [
      { to: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/employer/profile', label: 'Company Profile', icon: Building2 },
      { section: 'Recruitment' },
      { to: '/employer/jobs', label: 'My Jobs', icon: Briefcase },
      { to: '/employer/jobs/create', label: 'Post a Job', icon: ClipboardCheck },
      { to: '/employer/candidates', label: 'Find Candidates', icon: Search },
      { to: '/employer/applications', label: 'Applications', icon: FileText },
      { to: '/employer/hires', label: 'Hires', icon: TrendingUp },
      { section: 'Verification' },
      { to: '/employer/employment-verification', label: 'Verify Employment', icon: CheckCircle },
    ],
  },
  government: {
    title: 'Government',
    links: [
      { to: '/government/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { section: 'Analytics' },
      { to: '/government/districts', label: 'District Analytics', icon: MapPin },
      { to: '/government/skills', label: 'Skill Analytics', icon: Target },
      { to: '/government/training-effectiveness', label: 'Training Effectiveness', icon: GraduationCap },
      { to: '/government/employment', label: 'Employment Reports', icon: TrendingUp },
      { section: 'Reports' },
      { to: '/government/reports', label: 'Export Reports', icon: FileText },
    ],
  },
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const config = sidebarConfig[user?.role] || sidebarConfig.student;

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">SP</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--gray-900)' }}>
              SkillPulse
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)', fontWeight: 500 }}>
              {config.title} Panel
            </div>
          </div>
          <button
            className="lg:hidden ml-auto btn-ghost p-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {config.links.map((item, index) => {
            if (item.section) {
              return (
                <div key={index} className="sidebar-section">
                  {item.section}
                </div>
              );
            }

            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div style={{ padding: '0.875rem', borderTop: '1px solid var(--gray-100)', marginTop: 'auto', flexShrink: 0, background: 'white' }}>
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius)',
              background: 'var(--gray-50)',
              marginBottom: '0.5rem',
            }}
          >
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{
              width: '100%',
              color: 'var(--error-600)',
              background: '#fef2f2',
              fontWeight: 600,
              justifyContent: 'center',
              border: '1px solid #fee2e2',
              cursor: 'pointer',
            }}
            id="sidebar-logout-btn"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="lg:hidden btn-ghost p-1"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>SkillPulse</span>
              <span style={{ color: 'var(--gray-300)' }}>/</span>
              <span className="badge badge-primary" style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                {config.title} Panel
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <NavLink
              to={`/${user?.role === 'training_centre' ? 'training' : user?.role}/notifications`}
              style={{ position: 'relative', color: 'var(--gray-500)', display: 'flex', alignItems: 'center' }}
              title="Notifications"
            >
              <Bell size={20} />
            </NavLink>

            {/* User pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius)', background: 'var(--gray-50)' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block" style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-800)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)', textTransform: 'capitalize' }}>
                  {user?.role?.replace('_', ' ')}
                </div>
              </div>
            </div>

            {/* High-visibility Topbar Logout Button */}
            <button
              onClick={handleLogout}
              className="btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--error-600)',
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fee2e2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fef2f2';
              }}
              title="Log out of account"
              id="topbar-logout-btn"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
