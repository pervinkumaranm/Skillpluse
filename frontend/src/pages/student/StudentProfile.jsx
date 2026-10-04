import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/dataService';
import { DISTRICTS, EDUCATION_LEVELS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import {
  Save, User as UserIcon, FileText, Upload, Download, Trash2,
  Printer, CheckCircle, Award, Sparkles, MapPin, Phone, Mail,
  Briefcase, GraduationCap, Eye, ExternalLink, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const { user, loadUser } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'resume-preview'

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    education: '',
    experience: 0,
    experienceDetails: '',
    preferredRole: '',
    preferredLocation: '',
    about: '',
  });

  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await studentService.getProfile();
      const { user: u, profile: p } = res.data.data;
      setProfileData(p);
      setSkills(p?.skills || []);
      setFormData({
        name: u?.name || '',
        phone: u?.phone || '',
        district: u?.district || '',
        education: p?.education || '',
        experience: p?.experience || 0,
        experienceDetails: p?.experienceDetails || '',
        preferredRole: p?.preferredRole || '',
        preferredLocation: p?.preferredLocation || '',
        about: p?.about || '',
      });
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await studentService.updateProfile(formData);
      await loadUser();
      toast.success('Profile updated successfully!');
      // Update local profile state for resume
      setProfileData((prev) => ({
        ...prev,
        ...formData,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const [autoFilledNotice, setAutoFilledNotice] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const data = new FormData();
    data.append('resume', file);

    setUploadingResume(true);
    try {
      const res = await studentService.uploadResume(data);
      const resData = res.data?.data;

      if (resData) {
        const { parsedData, profile: updatedProfile, user: updatedUser } = resData;

        // Auto-fill form fields with parsed and updated values
        setFormData((prev) => ({
          ...prev,
          name: updatedUser?.name || parsedData?.name || prev.name,
          phone: updatedUser?.phone || parsedData?.phone || prev.phone,
          district: updatedUser?.district || parsedData?.district || prev.district,
          education: updatedProfile?.education || parsedData?.education || prev.education,
          experience: updatedProfile?.experience !== undefined ? updatedProfile.experience : (parsedData?.experience || prev.experience),
          preferredRole: updatedProfile?.preferredRole || parsedData?.preferredRole || prev.preferredRole,
          preferredLocation: updatedProfile?.preferredLocation || parsedData?.preferredLocation || prev.preferredLocation,
          about: updatedProfile?.about || parsedData?.about || prev.about,
        }));

        if (updatedProfile?.skills && updatedProfile.skills.length > 0) {
          setSkills(updatedProfile.skills);
        } else if (parsedData?.skills && parsedData.skills.length > 0) {
          setSkills((prev) => Array.from(new Set([...prev, ...parsedData.skills])));
        }

        setProfileData((prev) => ({
          ...prev,
          ...updatedProfile,
          resumeUrl: resData.resumeUrl,
          resumeFileName: resData.resumeFileName,
        }));

        const extractedList = [];
        if (parsedData?.name) extractedList.push('Name');
        if (parsedData?.phone) extractedList.push('Phone');
        if (parsedData?.district) extractedList.push('District');
        if (parsedData?.education) extractedList.push('Education');
        if (parsedData?.preferredRole) extractedList.push('Preferred Role');
        if (parsedData?.experience !== undefined && parsedData?.experience > 0) extractedList.push(`${parsedData.experience} Yrs Exp`);
        if (parsedData?.skills?.length) extractedList.push(`${parsedData.skills.length} Skills`);

        setAutoFilledNotice({
          fileName: file.name,
          items: extractedList.length > 0 ? extractedList.join(', ') : 'Profile Details',
        });

        toast.success('Resume parsed & profile details auto-filled!');
      } else {
        toast.success('Resume uploaded successfully!');
      }

      await loadUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload and parse resume');
    } finally {
      setUploadingResume(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to remove your attached resume?')) return;
    try {
      await studentService.deleteResume();
      toast.success('Resume removed');
      setProfileData((prev) => ({
        ...prev,
        resumeUrl: null,
        resumeFileName: null,
      }));
      await loadUser();
    } catch (err) {
      toast.error('Failed to remove resume');
    }
  };

  const handlePrintResume = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>My Profile & Digital Resume</h1>
          <p>Manage your professional credentials, upload your CV, and generate an official verifiable resume.</p>
        </div>

        {/* View mode toggle tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--gray-100)', padding: '0.25rem', borderRadius: 'var(--radius)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8125rem' }}
          >
            <UserIcon size={15} /> Edit Profile & Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resume-preview')}
            className={`btn ${activeTab === 'resume-preview' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8125rem' }}
          >
            <FileText size={15} /> View Digital Resume (CV)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'profile' ? 'repeat(auto-fit, minmax(340px, 1fr))' : '1fr', gap: '1.5rem' }}>
        {/* Left / Main Profile Details Form */}
        {(activeTab === 'profile' || window.innerWidth > 1024) && (
          <div style={{ display: activeTab === 'resume-preview' ? 'none' : 'block' }}>
            {/* Attached Resume Upload Card with AI Auto-Fill */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1.5px dashed var(--primary-400)', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                        AI Resume Scanner & Auto-Fill
                      </h3>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, background: 'var(--primary-100)', color: 'var(--primary-700)', padding: '0.15rem 0.5rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Sparkles size={11} /> Auto-Fill Active
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginTop: '0.125rem' }}>
                      Upload your PDF/DOC resume — your personal details, education, experience & skills below will auto-fill automatically!
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  id="resume-upload-input"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                  style={{ display: 'none' }}
                />
              </div>

              {uploadingResume ? (
                <div style={{
                  padding: '1.25rem',
                  background: 'white',
                  borderRadius: 'var(--radius)',
                  textAlign: 'center',
                  border: '1px solid var(--primary-200)',
                }}>
                  <div className="loading-spinner" style={{ margin: '0 auto 0.75rem', width: '28px', height: '28px' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-700)' }}>
                    Scanning & Parsing Resume Details...
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                    Extracting contact, education, experience, role, and skills into the form below
                  </div>
                </div>
              ) : profileData?.resumeUrl ? (
                <div style={{
                  padding: '0.875rem 1rem',
                  background: 'white',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--success-200)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                    <CheckCircle size={20} color="var(--success-600)" style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {profileData.resumeFileName || 'Candidate_Resume.pdf'}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--success-700)', fontWeight: 600 }}>
                        ✓ Attached & Parsed into Profile
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, alignItems: 'center' }}>
                    <a
                      href={profileData.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Download size={13} /> View
                    </a>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary-700)' }}
                      title="Upload a new resume to re-parse and update details"
                    >
                      <RefreshCw size={13} /> Re-scan / Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteResume}
                      className="btn-ghost"
                      style={{ padding: '0.35rem 0.5rem', color: 'var(--error-500)' }}
                      title="Remove resume"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.25rem 0' }}>
                  <button
                    type="button"
                    id="upload-resume-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingResume}
                    className="btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}
                  >
                    <Upload size={16} />
                    Upload Resume to Auto-Fill Details (PDF / DOC)
                  </button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                    Supported formats: PDF, DOC, DOCX, TXT • Max size: 5MB
                  </p>
                </div>
              )}
            </div>

            {/* Profile Form Card */}
            <div className="card" style={{ padding: '1.75rem' }}>
              {autoFilledNotice && (
                <div style={{
                  marginBottom: '1.5rem',
                  padding: '0.875rem 1.25rem',
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(16, 185, 129, 0.08))',
                  border: '1.5px solid var(--success-300)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--success-500)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                        Details Auto-Filled from Resume: {autoFilledNotice.fileName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-700)', marginTop: '0.125rem' }}>
                        Extracted: <strong style={{ color: 'var(--primary-700)' }}>{autoFilledNotice.items}</strong>. Review below and click <strong>"Save Profile"</strong>.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoFilledNotice(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem' }}
                  >
                    ✕ Dismiss
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-900)', margin: 0 }}>
                  Personal & Educational Details
                </h3>
                {autoFilledNotice && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success-700)', background: 'var(--success-50)', padding: '0.25rem 0.625rem', borderRadius: '999px' }}>
                    ✓ Auto-Filled
                  </span>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      className="form-input"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">District (Maharashtra) *</label>
                    <select
                      className="form-select"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    >
                      <option value="">Select District</option>
                      {DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Highest Education *</label>
                    <select
                      className="form-select"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    >
                      <option value="">Select Education</option>
                      {EDUCATION_LEVELS.map((ed) => (
                        <option key={ed} value={ed}>{ed}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Total Experience (Years)</label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      className="form-input"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Job Role</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Software Engineer / Data Analyst"
                      value={formData.preferredRole}
                      onChange={(e) => setFormData({ ...formData, preferredRole: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Preferred Work Location(s)</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Pune, Mumbai, Navi Mumbai, Nagpur"
                    value={formData.preferredLocation}
                    onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Professional Experience & Projects</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Mention previous internships, projects, or work history..."
                    value={formData.experienceDetails}
                    onChange={(e) => setFormData({ ...formData, experienceDetails: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">About / Career Objective</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Brief description about your career aspirations and key strengths..."
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    maxLength={500}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}
                >
                  <Save size={18} />
                  {saving ? 'Saving Details...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Right Column: Live Auto-Generated Maharashtra Digital Resume */}
        {(activeTab === 'resume-preview' || window.innerWidth > 1024) && (
          <div style={{ maxWidth: '800px', margin: activeTab === 'resume-preview' ? '0 auto' : '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                  Live Generated Resume (CV)
                </h3>
              </div>

              <button
                type="button"
                onClick={handlePrintResume}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.45rem 0.85rem', fontSize: '0.8125rem' }}
                title="Download or Print Resume as PDF"
              >
                <Printer size={15} /> Print / Save as PDF
              </button>
            </div>

            {/* Printable Digital Resume Container */}
            <div
              id="printable-resume"
              className="card"
              style={{
                padding: '2.5rem',
                background: '#ffffff',
                border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow-md)',
                color: '#1e293b',
                position: 'relative',
              }}
            >
              {/* Official Govt Header Stripe */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1.25rem',
                borderBottom: '2px solid var(--primary-600)',
                marginBottom: '1.5rem',
              }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                    {formData.name || 'Candidate Name'}
                  </h2>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-700)' }}>
                    {formData.preferredRole || 'Skilled Professional Candidate'}
                  </div>
                </div>

                {/* Candidate Verified Seal */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#15803d',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}>
                    <CheckCircle size={14} /> MSSDS VERIFIED
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: '0.25rem' }}>
                    SkillPulse ID: SP-{user?._id ? user._id.slice(-6).toUpperCase() : '847291'}
                  </div>
                </div>
              </div>

              {/* Contact Information Bar */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                fontSize: '0.8125rem',
                color: '#475569',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--gray-200)',
                marginBottom: '1.5rem',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Mail size={15} color="var(--primary-600)" />
                  {user?.email || 'email@example.com'}
                </span>
                {formData.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Phone size={15} color="var(--primary-600)" />
                    {formData.phone}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <MapPin size={15} color="var(--primary-600)" />
                  {formData.district ? `${formData.district}, Maharashtra` : 'Maharashtra, India'}
                </span>
              </div>

              {/* Summary / About */}
              {formData.about && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-800)', marginBottom: '0.5rem' }}>
                    Career Objective & Professional Summary
                  </h4>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#334155' }}>
                    {formData.about}
                  </p>
                </div>
              )}

              {/* Skills Matrix */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-800)' }}>
                    Verified Technical & Professional Skills
                  </h4>
                  <Link to="/student/skills" style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                    Manage Skills →
                  </Link>
                </div>
                {skills.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '6px',
                          background: '#eff6ff',
                          color: '#1e40af',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          border: '1px solid #dbeafe',
                        }}
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                    No skills added yet. <Link to="/student/skills" style={{ color: 'var(--primary-600)' }}>Click here to add your skills</Link>.
                  </p>
                )}
              </div>

              {/* Education & Qualifications */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-800)', marginBottom: '0.5rem' }}>
                  Education & Qualifications
                </h4>
                <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a' }}>
                    {formData.education || 'Graduate / Diploma Candidate'}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Recognized Institution • Maharashtra State Board / University
                  </div>
                </div>
              </div>

              {/* Experience & Practical Projects */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-800)', marginBottom: '0.5rem' }}>
                  Experience & Hands-on Training
                </h4>
                <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>
                      {formData.experience > 0 ? `${formData.experience} Years Industry Experience` : 'Entry-Level / Skilled Fresher'}
                    </div>
                    {formData.preferredLocation && (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Prefers: {formData.preferredLocation}
                      </span>
                    )}
                  </div>
                  {formData.experienceDetails && (
                    <p style={{ fontSize: '0.8125rem', color: '#334155', marginTop: '0.375rem', lineHeight: 1.5 }}>
                      {formData.experienceDetails}
                    </p>
                  )}
                </div>
              </div>

              {/* Govt Verification Watermark Footer */}
              <div style={{
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.6875rem',
                color: '#94a3b8',
              }}>
                <div>
                  Maharashtra State Skill Development Society (MSSDS) • Government of Maharashtra
                </div>
                <div>
                  SkillPulse Verified Digital Profile • Generated {new Date().toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
