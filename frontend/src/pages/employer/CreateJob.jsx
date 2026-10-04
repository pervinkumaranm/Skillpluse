import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/dataService';
import { DISTRICTS, EMPLOYMENT_TYPES, EDUCATION_LEVELS } from '../../utils/constants';
import { Save, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', district: '',
    employmentType: 'Full Time', experience: '', education: '',
    salaryMin: '', salaryMax: '', deadline: '',
  });

  const addSkill = () => {
    if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
      setRequiredSkills([...requiredSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requiredSkills.length === 0) return toast.error('Add at least one required skill');
    setLoading(true);
    try {
      await jobService.createJob({
        ...formData,
        requiredSkills,
        salaryRange: formData.salaryMin || formData.salaryMax
          ? { min: parseInt(formData.salaryMin) || undefined, max: parseInt(formData.salaryMax) || undefined }
          : undefined,
      });
      toast.success('Job posted!');
      navigate('/employer/jobs');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header"><div><h1>Post a Job</h1><p>Create a new job listing.</p></div></div>
      <div className="card card-body" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input className="form-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows="4" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">District</label>
              <select className="form-input form-select" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })}>
                <option value="">Select</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input form-select" value={formData.employmentType} onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}>
                {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Experience</label>
              <input className="form-input" placeholder="e.g. 0-2 years" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Education</label>
              <select className="form-input form-select" value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })}>
                <option value="">Any</option>
                {EDUCATION_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Min Salary (₹)</label>
              <input type="number" className="form-input" value={formData.salaryMin} onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Salary (₹)</label>
              <input type="number" className="form-input" value={formData.salaryMax} onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input type="date" className="form-input" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input className="form-input" placeholder="Add required skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <button type="button" className="btn btn-secondary" onClick={addSkill}><Plus size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {requiredSkills.map((s, i) => (
                <span key={i} className="skill-tag">{s}
                  <button type="button" onClick={() => setRequiredSkills(requiredSkills.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> : <><Save size={16} /> Post Job</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
