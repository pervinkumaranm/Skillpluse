import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_PATHS, ROLES, DISTRICTS, EDUCATION_LEVELS } from '../../utils/constants';
import { UserPlus, ArrowLeft, ArrowRight, GraduationCap, Building2, BookOpen, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const roleCards = [
  { value: ROLES.STUDENT, label: 'Student', icon: GraduationCap, desc: 'Find training and jobs', color: '#3b82f6' },
  { value: ROLES.TRAINING_CENTRE, label: 'Training Centre', icon: BookOpen, desc: 'Create training programs', color: '#f59e0b' },
  { value: ROLES.EMPLOYER, label: 'Employer', icon: Building2, desc: 'Post jobs and hire', color: '#22c55e' },
  { value: ROLES.GOVERNMENT, label: 'Government', icon: Shield, desc: 'Analytics & oversight', color: '#8b5cf6' },
];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '', name: '', email: '', phone: '', password: '', confirmPassword: '',
    district: '', education: '', skills: '',
    companyName: '', industry: '', address: '',
    centreName: '', department: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const payload = {
        role: formData.role,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        district: formData.district,
      };

      if (formData.role === ROLES.STUDENT) {
        payload.name = formData.name;
        payload.education = formData.education;
        payload.skills = formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
      } else if (formData.role === ROLES.EMPLOYER) {
        payload.name = formData.companyName;
        payload.companyName = formData.companyName;
        payload.industry = formData.industry;
        payload.address = formData.address;
      } else if (formData.role === ROLES.TRAINING_CENTRE) {
        payload.name = formData.centreName;
        payload.centreName = formData.centreName;
        payload.address = formData.address;
      } else if (formData.role === ROLES.GOVERNMENT) {
        payload.name = formData.name;
        payload.department = formData.department;
      }

      const user = await register(payload);
      toast.success('Registration successful!');
      navigate(ROLE_PATHS[user.role] || '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0e7ff 100%)',
      padding: '2rem',
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-2xl)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '520px',
        boxShadow: 'var(--shadow-xl)',
      }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Create Account</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {step === 1 ? 'Choose your role to get started' : 'Fill in your details'}
        </p>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[1, 2].map((s) => (
            <div key={s} style={{
              flex: 1,
              height: '4px',
              borderRadius: 'var(--radius-full)',
              background: s <= step ? 'var(--primary-600)' : 'var(--gray-200)',
              transition: 'background 0.3s ease',
            }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {roleCards.map((role) => {
                const Icon = role.icon;
                const selected = formData.role === role.value;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      border: `2px solid ${selected ? role.color : 'var(--gray-200)'}`,
                      background: selected ? `${role.color}08` : 'white',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={28} style={{ color: role.color, margin: '0 auto 0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{role.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{role.desc}</div>
                  </button>
                );
              })}
            </div>
            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1.5rem' }}
              disabled={!formData.role}
              onClick={() => setStep(2)}
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            {/* Common fields */}
            {(formData.role === ROLES.STUDENT || formData.role === ROLES.GOVERNMENT) && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input id="name" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
              </div>
            )}

            {formData.role === ROLES.EMPLOYER && (
              <div className="form-group">
                <label className="form-label" htmlFor="companyName">Company Name</label>
                <input id="companyName" name="companyName" className="form-input" value={formData.companyName} onChange={handleChange} required />
              </div>
            )}

            {formData.role === ROLES.TRAINING_CENTRE && (
              <div className="form-group">
                <label className="form-label" htmlFor="centreName">Centre Name</label>
                <input id="centreName" name="centreName" className="form-input" value={formData.centreName} onChange={handleChange} required />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="form-input" value={formData.email} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input id="password" name="password" type="password" className="form-input" value={formData.password} onChange={handleChange} required minLength={6} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm</label>
                <input id="confirmPassword" name="confirmPassword" type="password" className="form-input" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" className="form-input" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="district">District</label>
              <select id="district" name="district" className="form-input form-select" value={formData.district} onChange={handleChange}>
                <option value="">Select District</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Role-specific fields */}
            {formData.role === ROLES.STUDENT && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="education">Education</label>
                  <select id="education" name="education" className="form-input form-select" value={formData.education} onChange={handleChange}>
                    <option value="">Select Education</option>
                    {EDUCATION_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="skills">Skills (comma separated)</label>
                  <input id="skills" name="skills" className="form-input" placeholder="e.g. Java, Python, SQL" value={formData.skills} onChange={handleChange} />
                </div>
              </>
            )}

            {formData.role === ROLES.EMPLOYER && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="industry">Industry</label>
                  <input id="industry" name="industry" className="form-input" placeholder="e.g. IT, Manufacturing" value={formData.industry} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="address">Address</label>
                  <input id="address" name="address" className="form-input" value={formData.address} onChange={handleChange} />
                </div>
              </>
            )}

            {formData.role === ROLES.TRAINING_CENTRE && (
              <div className="form-group">
                <label className="form-label" htmlFor="address">Address</label>
                <input id="address" name="address" className="form-input" value={formData.address} onChange={handleChange} />
              </div>
            )}

            {formData.role === ROLES.GOVERNMENT && (
              <div className="form-group">
                <label className="form-label" htmlFor="department">Department</label>
                <input id="department" name="department" className="form-input" placeholder="e.g. Skill Development" value={formData.department} onChange={handleChange} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                {loading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : <><UserPlus size={16} /> Register</>}
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
