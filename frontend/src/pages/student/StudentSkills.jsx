import { useState, useEffect } from 'react';
import { studentService } from '../../services/dataService';
import { Target, Plus, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentSkills = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await studentService.getSkills();
        setSkills(res.data.data.skills || []);
      } catch (err) {
        toast.error('Failed to load skills');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill) return;
    if (skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      return toast.error('Skill already exists');
    }
    setSkills([...skills, skill]);
    setNewSkill('');
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await studentService.updateSkills(skills);
      toast.success('Skills updated successfully');
    } catch (err) {
      toast.error('Failed to save skills');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading skills...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Skills</h1>
          <p>Add and manage your skills to improve job matching.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> : <><Save size={16} /> Save Skills</>}
        </button>
      </div>

      <div className="card card-body" style={{ maxWidth: '700px' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input
            className="form-input"
            placeholder="Type a skill (e.g. Java, Python, SQL)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={addSkill}>
            <Plus size={16} /> Add
          </button>
        </div>

        {skills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {skills.map((skill, i) => (
              <span key={i} className="skill-tag" style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}>
                {skill}
                <button onClick={() => removeSkill(i)} className="remove" style={{ background: 'none', border: 'none', padding: 0, display: 'flex' }}>
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Target size={40} />
            <h3>No skills added</h3>
            <p>Add your skills above to start getting matched with jobs.</p>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--primary-50)', borderRadius: 'var(--radius)', border: '1px solid var(--primary-100)' }}>
          <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--primary-700)', marginBottom: '0.5rem' }}>
            💡 Suggested Skills
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {['Java', 'Python', 'SQL', 'React', 'Node.js', 'Cloud Computing', 'Data Analytics', 'Cyber Security', 'Machine Learning', 'Git']
              .filter((s) => !skills.some((sk) => sk.toLowerCase() === s.toLowerCase()))
              .map((s, i) => (
                <button
                  key={i}
                  className="btn btn-sm"
                  style={{ background: 'white', border: '1px solid var(--primary-200)', color: 'var(--primary-600)', fontSize: '0.75rem' }}
                  onClick={() => {
                    setSkills([...skills, s]);
                    toast.success(`${s} added`);
                  }}
                >
                  <Plus size={12} /> {s}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSkills;
