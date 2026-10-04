import { Link } from 'react-router-dom';
import {
  ArrowRight, Target, Briefcase, BookOpen, Shield, BarChart3,
  CheckCircle, Users, Building2, GraduationCap, TrendingUp,
  ChevronRight, Zap, Award, MapPin, Star,
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Target,
      title: 'Skill Gap Detection',
      desc: 'AI-powered analysis comparing student skills against industry requirements to identify precise gaps.',
      color: '#3b82f6',
      bg: '#eff6ff',
    },
    {
      icon: Briefcase,
      title: 'Smart Job Matching',
      desc: 'Intelligent matching engine that connects candidates with the right opportunities based on skills.',
      color: '#8b5cf6',
      bg: '#f5f3ff',
    },
    {
      icon: BookOpen,
      title: 'Training Tracking',
      desc: 'End-to-end tracking of training programs from enrollment to certification and beyond.',
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      icon: Shield,
      title: 'Employment Verification',
      desc: 'Multi-level verification ensuring authentic employment records and outcomes.',
      color: '#22c55e',
      bg: '#f0fdf4',
    },
    {
      icon: BarChart3,
      title: 'Government Analytics',
      desc: 'Real-time district-wise analytics for data-driven policy decisions on skilling initiatives.',
      color: '#ef4444',
      bg: '#fef2f2',
    },
    {
      icon: Users,
      title: 'Reverse Matching',
      desc: 'Employers can discover pre-qualified, trained candidates matching their exact requirements.',
      color: '#06b6d4',
      bg: '#ecfeff',
    },
  ];

  const workflow = [
    { icon: Target, label: 'Skills Assessment', desc: 'Identify current skills' },
    { icon: BookOpen, label: 'Training', desc: 'Skill-based programs' },
    { icon: Award, label: 'Certification', desc: 'Verified credentials' },
    { icon: Briefcase, label: 'Job Matching', desc: 'AI-powered placement' },
    { icon: Building2, label: 'Employment', desc: 'Verified outcomes' },
    { icon: BarChart3, label: 'Analytics', desc: 'Government insights' },
  ];

  const stats = [
    { value: '36', label: 'Districts Covered', icon: MapPin },
    { value: '4', label: 'Stakeholder Roles', icon: Users },
    { value: '100%', label: 'Verified Outcomes', icon: CheckCircle },
    { value: 'Real-time', label: 'Analytics Dashboard', icon: TrendingUp },
  ];

  const roles = [
    {
      icon: GraduationCap,
      title: 'Students',
      desc: 'Track skills, find training, get matched to jobs, and build your career.',
      color: '#3b82f6',
    },
    {
      icon: BookOpen,
      title: 'Training Centres',
      desc: 'Create programs, track students, issue certificates, and measure outcomes.',
      color: '#f59e0b',
    },
    {
      icon: Building2,
      title: 'Employers',
      desc: 'Post jobs, find trained candidates, and verify employment records.',
      color: '#22c55e',
    },
    {
      icon: Shield,
      title: 'Government Officers',
      desc: 'Access district analytics, track effectiveness, and make data-driven decisions.',
      color: '#8b5cf6',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--gray-100)',
        zIndex: 50,
        padding: '0 1.5rem',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius)',
              background: 'linear-gradient(135deg, #2563eb, #1e40af)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.875rem',
            }}>
              SP
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--gray-900)', lineHeight: 1.2 }}>
                SkillPulse
              </div>
              <div style={{ fontSize: '0.625rem', color: 'var(--primary-600)', fontWeight: 600, letterSpacing: '0.05em' }}>
                MAHARASHTRA
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '5rem 1.5rem',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0e7ff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', maxWidth: '800px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 1rem',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(124, 58, 237, 0.08))',
            border: '1px solid var(--primary-200)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--primary-700)',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            letterSpacing: '0.01em',
          }}>
            <Zap size={14} />
            SkillPulse • Maharashtra's Premier Skilling & Employment Platform
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            From Skills to Employment
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: 'var(--gray-600)',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            lineHeight: 1.7,
          }}>
            An intelligent skilling and employment ecosystem for Maharashtra —
            connecting students, training centres, employers, and government
            to build a skilled workforce.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{
        background: 'var(--gray-900)',
        padding: '2rem 1.5rem',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}>
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon size={20} style={{ color: 'var(--primary-400)' }} />
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--gray-500)', fontStyle: 'italic' }}>
              Platform capabilities — Demo data for demonstration purposes
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Platform Features
            </h2>
            <p style={{ color: 'var(--gray-500)', maxWidth: '500px', margin: '0 auto' }}>
              A comprehensive ecosystem designed to bridge the gap between skills and employment.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem',
          }}>
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="card" style={{
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--gray-100)',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-lg)',
                    background: feature.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}>
                    <Icon size={22} style={{ color: feature.color }} />
                  </div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section style={{
        padding: '5rem 1.5rem',
        background: 'linear-gradient(180deg, var(--gray-50) 0%, white 100%)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Complete Skills-to-Employment Journey
            </h2>
            <p style={{ color: 'var(--gray-500)', maxWidth: '500px', margin: '0 auto' }}>
              Track every step from skill assessment to verified employment outcomes.
            </p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'center',
          }}>
            {workflow.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1.25rem 1.5rem',
                    background: 'white',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--gray-100)',
                    boxShadow: 'var(--shadow-sm)',
                    minWidth: '140px',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--primary-50)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={18} style={{ color: 'var(--primary-600)' }} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{step.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{step.desc}</div>
                  </div>
                  {i < workflow.length - 1 && (
                    <ChevronRight size={20} style={{ color: 'var(--gray-300)', flexShrink: 0 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Built for Everyone
            </h2>
            <p style={{ color: 'var(--gray-500)', maxWidth: '500px', margin: '0 auto' }}>
              Dedicated dashboards and tools for every stakeholder in the ecosystem.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {roles.map((role, i) => {
              const Icon = role.icon;
              return (
                <div key={i} style={{
                  background: 'white',
                  border: '1px solid var(--gray-100)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-full)',
                    background: `${role.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}>
                    <Icon size={26} style={{ color: role.color }} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {role.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>
                    {role.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '4rem 1.5rem',
        background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>
            Ready to Transform Maharashtra's Workforce?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Join SkillPulse Maharashtra and be part of the skills revolution.
          </p>
          <Link to="/register" className="btn btn-lg" style={{
            background: 'white',
            color: 'var(--primary-700)',
            fontWeight: 700,
          }}>
            Get Started Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--gray-900)',
        color: 'var(--gray-400)',
        padding: '2rem 1.5rem',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{ fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
              SkillPulse Maharashtra
            </div>
            <div style={{ fontSize: '0.8125rem' }}>
              SkillPulse Maharashtra • Unified Skilling & Employment Ecosystem
            </div>
          </div>
          <div style={{ fontSize: '0.75rem' }}>
            Built with ❤️ for Maharashtra | Demo Project
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
