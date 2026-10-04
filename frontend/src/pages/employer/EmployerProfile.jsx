import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/dataService';
import { DISTRICTS, INDUSTRIES } from '../../utils/constants';
import { Building2, Globe, MapPin, Users, Briefcase, Award, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployerProfile = () => {
  const { user, profile, loadUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    industry: 'Information Technology & Software',
    district: 'Pune',
    address: '',
    website: '',
    employeeCount: '50-200',
    description: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user || profile) {
      setFormData({
        name: user?.name || '',
        companyName: profile?.companyName || user?.name || '',
        industry: profile?.industry || 'Information Technology & Software',
        district: user?.district || 'Pune',
        address: profile?.address || '',
        website: profile?.website || '',
        employeeCount: profile?.employeeCount || '50-200',
        description: profile?.description || '',
        phone: user?.phone || '',
      });
    }
  }, [user, profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await authService.updateProfile(formData);
      await loadUser();
      toast.success('Company profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1>Company Profile</h1>
          <p>Manage your organization details, hiring sectors, and contact information.</p>
        </div>
      </div>

      {/* Stats Header Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius)', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Jobs Published</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)' }}>
              {profile?.totalJobsPosted || 0}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius)', background: 'var(--success-50)', color: 'var(--success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Total Candidates Hired</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success-600)' }}>
              {profile?.totalHires || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Industry Sector *</label>
              <select
                className="form-select"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Headquarters District (Maharashtra) *</label>
              <select
                className="form-select"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Company Size</label>
              <select
                className="form-select"
                value={formData.employeeCount}
                onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
              >
                <option value="1-10">1-10 Employees (Startup)</option>
                <option value="11-50">11-50 Employees (Small)</option>
                <option value="50-200">50-200 Employees (Medium)</option>
                <option value="200-1000">200-1000 Employees (Large)</option>
                <option value="1000+">1000+ Employees (Enterprise)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Website URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://company.example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-input"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Full Office Address</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Company Overview / Description</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Describe your company, work culture, and mission in Maharashtra..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}
          >
            <Save size={18} />
            {saving ? 'Saving Profile...' : 'Save Company Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployerProfile;
