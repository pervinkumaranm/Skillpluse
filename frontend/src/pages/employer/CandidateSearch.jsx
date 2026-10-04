import { useState } from 'react';
import { matchingService } from '../../services/dataService';
import { getMatchScoreClass } from '../../utils/constants';
import { Search, Plus, X, Users, Target, Award, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const CandidateSearch = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSearch = async () => {
    if (skills.length === 0) return toast.error('Add at least one skill');
    setLoading(true);
    setSearched(true);
    try {
      const res = await matchingService.matchJobCandidates({ requiredSkills: skills });
      setCandidates(res.data.data.candidates || []);
    } catch (err) { toast.error('Failed to search'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Find Candidates</h1>
          <p>Reverse matching — define required skills and find pre-qualified candidates.</p>
        </div>
      </div>

      <div className="card card-body" style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '0.5rem' }}>
          <Target size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }} />
          Skill Matching Engine
        </h4>
        <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
          Enter the skills you require. The system will find and rank candidates based on weighted scoring:
          Skill Match (60%) • Training (15%) • Certification (10%) • Education (10%) • Experience (5%)
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input className="form-input" placeholder="Type a required skill (e.g. Java)" value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} style={{ flex: 1 }} />
          <button className="btn btn-secondary" onClick={addSkill}><Plus size={16} /></button>
          <button className="btn btn-primary" onClick={handleSearch} disabled={loading || skills.length === 0}>
            {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> : <><Search size={16} /> Search</>}
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {skills.map((s, i) => (
            <span key={i} className="skill-tag">{s}
              <button onClick={() => setSkills(skills.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={12} /></button>
            </span>
          ))}
        </div>
      </div>

      {/* Results */}
      {searched && (
        candidates.length > 0 ? (
          <div>
            <h4 style={{ marginBottom: '1rem' }}>{candidates.length} Candidates Found</h4>
            <div className="grid-cards">
              {candidates.map((c, i) => {
                const score = c.matchResult?.totalScore || 0;
                const details = c.matchResult?.skillDetails || {};
                return (
                  <div key={i} className="card card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem' }}>{c.name}</h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{c.email}</p>
                      </div>
                      <div className={`match-score ${getMatchScoreClass(score)}`} style={{ fontSize: '1.25rem' }}>
                        {score}%
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span>📍 {c.district}</span>
                      <span><GraduationCap size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {c.education || 'N/A'}</span>
                      <span><Award size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {c.certificates} certs</span>
                    </div>

                    {details.matchedSkills?.length > 0 && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--gray-400)', marginBottom: '0.25rem' }}>MATCHED</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {details.matchedSkills.map((s, j) => <span key={j} className="skill-tag matched" style={{ fontSize: '0.6875rem' }}>{s}</span>)}
                        </div>
                      </div>
                    )}

                    {details.missingSkills?.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--gray-400)', marginBottom: '0.25rem' }}>MISSING</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {details.missingSkills.map((s, j) => <span key={j} className="skill-tag missing" style={{ fontSize: '0.6875rem' }}>{s}</span>)}
                        </div>
                      </div>
                    )}

                    {/* Score breakdown */}
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--radius)', fontSize: '0.75rem' }}>
                      <div style={{ fontWeight: 600, marginBottom: '0.375rem' }}>Score Breakdown</div>
                      {c.matchResult?.breakdown && Object.entries(c.matchResult.breakdown).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.125rem' }}>
                          <span style={{ color: 'var(--gray-500)', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span style={{ fontWeight: 600 }}>{val.weighted}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3rem' }}>
            <Users size={48} /><h3>No matching candidates</h3><p>Try different skill requirements.</p>
          </div>
        )
      )}
    </div>
  );
};

export default CandidateSearch;
