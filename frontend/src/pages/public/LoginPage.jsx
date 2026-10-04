import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_PATHS } from '../../utils/constants';
import {
  LogIn, Mail, Lock, ArrowLeft, Eye, EyeOff,
  GraduationCap, Building2, Briefcase, ShieldCheck,
  Zap, CheckCircle, Sparkles, MapPin, Award
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEMO_USERS = [
  {
    role: 'student',
    title: 'Student / Candidate',
    email: 'demo.student@skillpulse.in',
    password: 'Demo@123',
    name: 'Aarav Sharma',
    icon: GraduationCap,
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
    description: 'Browse jobs, skill gap analysis & certificates',
  },
  {
    role: 'training_centre',
    title: 'Training Centre',
    email: 'demo.training@skillpulse.in',
    password: 'Demo@123',
    name: 'Maharashtra Skills Academy',
    icon: Building2,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    description: 'Manage batches, enrollments & assessments',
  },
  {
    role: 'employer',
    title: 'Hiring Employer',
    email: 'demo.employer@skillpulse.in',
    password: 'Demo@123',
    name: 'TechMaharashtra Solutions',
    icon: Briefcase,
    color: '#0ea5e9',
    bg: '#f0f9ff',
    border: '#bae6fd',
    description: 'Post jobs, reverse match & verify outcomes',
  },
  {
    role: 'government',
    title: 'Government Officer',
    email: 'demo.govt@skillpulse.in',
    password: 'Demo@123',
    name: 'Rajesh Pawar (MSSDS)',
    icon: ShieldCheck,
    color: '#10b981',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    description: 'Statewide 36-district analytics & reports',
  },
];

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: 'demo.student@skillpulse.in',
    password: 'Demo@123',
  });
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoLoggingIn, setAutoLoggingIn] = useState(null);

  const handleQuickSelect = (demo) => {
    setSelectedRole(demo.role);
    setFormData({ email: demo.email, password: demo.password });
  };

  const handleQuickLogin = async (demo) => {
    setAutoLoggingIn(demo.role);
    setSelectedRole(demo.role);
    setFormData({ email: demo.email, password: demo.password });

    try {
      const user = await login(demo.email, demo.password);
      toast.success(`Logged in as ${demo.title}: ${user.name}!`);
      navigate(ROLE_PATHS[user.role] || '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Quick login failed');
    } finally {
      setAutoLoggingIn(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(ROLE_PATHS[user.role] || '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password. Click a Quick Demo button below!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#f8fafc',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glowing orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
      }} />

      {/* Left Showcase Panel */}
      <div style={{
        flex: '1.1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3.5rem',
        position: 'relative',
        zIndex: 1,
      }}
        className="hidden lg:flex"
      >
        <div>
          {/* Top Home link & Brand */}
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#94a3b8',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              marginBottom: '2.5rem',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            <ArrowLeft size={16} /> Back to Public Portal
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.75rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: '1.25rem',
              boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
            }}>
              SP
            </div>
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                SkillPulse Maharashtra
              </div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, letterSpacing: '0.04em' }}>
                MSSDS GOVT INITIATIVE • AI-POWERED PLATFORM
              </div>
            </div>
          </div>

          <h1 style={{
            fontSize: '2.75rem',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#fff',
            marginBottom: '1rem',
            letterSpacing: '-0.03em',
          }}>
            From Skills to <br />
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Verified Employment.
            </span>
          </h1>

          <p style={{
            color: '#94a3b8',
            fontSize: '1.0625rem',
            lineHeight: 1.6,
            maxWidth: '460px',
            marginBottom: '2rem',
          }}>
            Connecting students, accredited training centres, verified employers, and government policy officers across all 36 districts of Maharashtra.
          </p>

          {/* Core Feature Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: '440px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
            }}>
              <Sparkles size={18} color="#60a5fa" />
              <span style={{ fontSize: '0.875rem', color: '#e2e8f0', fontWeight: 500 }}>
                Weighted AI Skill Matching (Skills 60%, Training 15%, Cert 10%)
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
            }}>
              <MapPin size={18} color="#34d399" />
              <span style={{ fontSize: '0.875rem', color: '#e2e8f0', fontWeight: 500 }}>
                Statewide District Analytics across all 36 Maharashtra Districts
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
            }}>
              <Award size={18} color="#fbbf24" />
              <span style={{ fontSize: '0.875rem', color: '#e2e8f0', fontWeight: 500 }}>
                Tamper-Evident QR Verifiable Certificates with MSSDS Seal
              </span>
            </div>
          </div>
        </div>

        {/* Bottom stats banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>36 / 36</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Districts Tracked</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>74.2%</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Placement Rate</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa' }}>100%</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Audit Trail</div>
          </div>
        </div>
      </div>

      {/* Right Login & Quick Access Panel */}
      <div style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        zIndex: 2,
      }}>
        <div style={{
          width: '100%',
          maxWidth: '520px',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '24px',
          padding: '2.25rem',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
          color: 'var(--gray-900)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        }}>
          {/* Top header for mobile / branding */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: 'var(--gray-500)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={15} /> Back
            </Link>

            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', background: 'var(--primary-50)', padding: '0.25rem 0.625rem', borderRadius: '999px' }}>
              SKILLPULSE SECURE PORTAL
            </span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
              Sign In to SkillPulse
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              Select your role below or enter your credentials
            </p>
          </div>

          {/* ⚡ 1-Click Role Quick Login Grid */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-700)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Zap size={14} color="#f59e0b" style={{ fill: '#f59e0b' }} />
                1-Click Quick Demo Login:
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--gray-400)' }}>Tap to test any role</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
              {DEMO_USERS.map((demo) => {
                const Icon = demo.icon;
                const isSelected = selectedRole === demo.role;
                const isLoggingIn = autoLoggingIn === demo.role;

                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleQuickLogin(demo)}
                    disabled={loading || !!autoLoggingIn}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.75rem 0.875rem',
                      borderRadius: '12px',
                      background: isSelected ? demo.bg : 'var(--gray-50)',
                      border: `1.5px solid ${isSelected ? demo.color : 'var(--gray-200)'}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = demo.color;
                        e.currentTarget.style.background = demo.bg;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'var(--gray-200)';
                        e.currentTarget.style.background = 'var(--gray-50)';
                      }
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isSelected ? demo.color : '#fff',
                      color: isSelected ? '#fff' : demo.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {isLoggingIn ? 'Logging in...' : demo.title}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: demo.color, fontWeight: 600 }}>
                        ⚡ 1-Click Login
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.25rem',
            color: 'var(--gray-400)',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--gray-200)' }} />
            <span>OR LOGIN MANUALLY</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--gray-200)' }} />
          </div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="email" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
                  placeholder="demo.student@skillpulse.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <label className="form-label" htmlFor="password" style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 0 }}>
                  Password
                </label>
                <span style={{ fontSize: '0.6875rem', color: 'var(--gray-400)' }}>
                  Demo: <strong>Demo@123</strong>
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', fontSize: '0.875rem' }}
                  placeholder="Demo@123"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-400)', padding: '0.25rem', cursor: 'pointer' }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: 700,
                fontSize: '0.9375rem',
                padding: '0.875rem',
              }}
              disabled={loading || !!autoLoggingIn}
            >
              {loading ? (
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
              ) : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 700, textDecoration: 'none' }}>
              Register for SkillPulse →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
