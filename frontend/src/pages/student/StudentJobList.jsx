import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/dataService';
import { studentService } from '../../services/dataService';
import { getMatchScoreClass, formatSalary, DISTRICTS, STATUS_COLORS } from '../../utils/constants';
import { Briefcase, MapPin, Clock, Search, ArrowRight, Building2 } from 'lucide-react';

const StudentJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [jobsRes, recRes] = await Promise.all([
          jobService.getJobs({ search, district, limit: 20 }),
          studentService.getRecommendedJobs(),
        ]);
        setJobs(jobsRes.data.data);
        setRecommended(recRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search, district]);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Finding jobs...</p></div>;

  const displayJobs = recommended.length > 0 ? recommended : jobs.map((job) => ({ job, matchScore: 0, matchedSkills: [], missingSkills: [] }));

  return (
    <div>
      <div className="page-header">
        <div><h1>Browse Jobs</h1><p>Find jobs matching your skills. Match scores are calculated in real-time.</p></div>
      </div>

      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input className="form-input" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
        </div>
        <select className="form-input form-select" style={{ maxWidth: '200px' }} value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">All Districts</option>
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {displayJobs.length > 0 ? (
        <div className="grid-cards">
          {displayJobs.map((item, i) => {
            const job = item.job;
            return (
              <div key={i} className="card card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{job.title}</h4>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Building2 size={14} /> {job.companyName || 'Company'}
                    </div>
                  </div>
                  {item.matchScore > 0 && (
                    <div className={`match-score ${getMatchScoreClass(item.matchScore)}`} style={{ fontSize: '1.125rem' }}>
                      {item.matchScore}%
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
                  {job.district && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {job.district}</span>}
                  {job.employmentType && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {job.employmentType}</span>}
                  {job.salaryRange && <span>{formatSalary(job.salaryRange?.min, job.salaryRange?.max)}</span>}
                </div>

                {item.matchedSkills?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
                    {item.matchedSkills.slice(0, 5).map((s, j) => (
                      <span key={j} className="skill-tag matched" style={{ fontSize: '0.6875rem' }}>{s}</span>
                    ))}
                    {item.missingSkills?.slice(0, 3).map((s, j) => (
                      <span key={j} className="skill-tag missing" style={{ fontSize: '0.6875rem' }}>{s}</span>
                    ))}
                  </div>
                )}

                <Link to={`/student/jobs/${job._id}`} className="btn btn-secondary btn-sm" style={{ marginTop: 'auto' }}>
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3rem' }}>
          <Briefcase size={48} />
          <h3>No jobs found</h3>
          <p>Try different search terms or filters.</p>
        </div>
      )}
    </div>
  );
};

export default StudentJobList;
