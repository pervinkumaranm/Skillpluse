import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trainingService } from '../../services/dataService';
import { DISTRICTS, formatDate } from '../../utils/constants';
import { BookOpen, MapPin, Calendar, Users, Search, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentTrainingList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await trainingService.getPrograms({ search, district, limit: 20 });
        setPrograms(res.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [search, district]);

  const handleEnroll = async (id) => {
    try {
      await trainingService.enrollStudent(id);
      toast.success('Enrolled successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enroll');
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading programs...</p></div>;

  return (
    <div>
      <div className="page-header"><div><h1>Training Programs</h1><p>Browse and enroll in available training programs.</p></div></div>

      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input className="form-input" placeholder="Search programs..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
        </div>
        <select className="form-input form-select" style={{ maxWidth: '200px' }} value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">All Districts</option>
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {programs.length > 0 ? (
        <div className="grid-cards">
          {programs.map((program) => (
            <div key={program._id} className="card card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className={`badge ${program.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>{program.status}</span>
                <span className="badge badge-blue">{program.mode}</span>
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>{program.title}</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                {program.description?.substring(0, 120)}...
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {program.district}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {program.duration}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14} /> {program.enrolled}/{program.capacity}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                {program.skillsCovered?.slice(0, 5).map((s, i) => (
                  <span key={i} className="skill-tag" style={{ fontSize: '0.6875rem' }}>{s}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => handleEnroll(program._id)}>Enroll</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3rem' }}>
          <BookOpen size={48} /><h3>No programs found</h3><p>Check back later for new training programs.</p>
        </div>
      )}
    </div>
  );
};

export default StudentTrainingList;
