import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trainingService } from '../../services/dataService';
import { DISTRICTS, SKILL_CATEGORIES } from '../../utils/constants';
import { Save, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', duration: '',
    mode: 'Offline', eligibility: '', capacity: 30,
    startDate: '', endDate: '',
  });

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (skills.length === 0) return toast.error('Add at least one skill');
    setLoading(true);
    try {
      await trainingService.createProgram({ ...formData, skillsCovered: skills });
      toast.success('Course created!');
      navigate('/training/courses');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header"><div><h1>Create Course</h1><p>Create a new training program.</p></div></div>
      <div className="card card-body" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input form-select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="">Select</option>
                {SKILL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Duration</label>
              <input className="form-input" placeholder="e.g. 3 months" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Mode</label>
              <select className="form-input form-select" value={formData.mode} onChange={(e) => setFormData({ ...formData, mode: e.target.value })}>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Capacity</label>
              <input type="number" min="1" className="form-input" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Eligibility</label>
              <input className="form-input" placeholder="e.g. 12th Pass" value={formData.eligibility} onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input type="date" className="form-input" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input type="date" className="form-input" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label className="form-label">Skills Covered</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input className="form-input" placeholder="Add a skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <button type="button" className="btn btn-secondary" onClick={addSkill}><Plus size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {skills.map((s, i) => (
                <span key={i} className="skill-tag">{s}
                  <button type="button" onClick={() => setSkills(skills.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> : <><Save size={16} /> Create Course</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
