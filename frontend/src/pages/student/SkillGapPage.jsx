import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/dataService';
import { getMatchScoreClass } from '../../utils/constants';
import { TrendingUp, AlertCircle, CheckCircle, Target, ArrowRight } from 'lucide-react';

const SkillGapPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await studentService.getSkillGap();
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load skill gap analysis');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Analyzing skills...</p></div>;
  if (error) return <div className="empty-state"><AlertCircle size={48} /><h3>Error</h3><p>{error}</p></div>;

  if (data?.message) {
    return (
      <div>
        <div className="page-header"><div><h1>Skill Gap Analysis</h1><p>Compare your skills against job requirements.</p></div></div>
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '3rem' }}>
          <Target size={48} />
          <h3>{data.message}</h3>
          <Link to="/student/skills" className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Skills <ArrowRight size={16} /></Link>
        </div>
      </div>
    );
  }

  const { studentSkills, overallGap, jobGaps } = data;

  return (
    <div>
      <div className="page-header">
        <div><h1>Skill Gap Analysis</h1><p>Real-time analysis comparing your skills against job market requirements.</p></div>
      </div>

      {/* Overall Summary */}
      <div className="grid-stats" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--primary-600)' }}>{overallGap?.matchScore || 0}%</div>
          <div className="stat-label">Overall Match Score</div>
          <div className="progress-bar" style={{ marginTop: '0.75rem' }}>
            <div className="progress-fill" style={{ width: `${overallGap?.matchScore || 0}%` }}></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overallGap?.totalMatched || 0}</div>
          <div className="stat-label">Skills Matched</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--error-500)' }}>{overallGap?.totalMissing || 0}</div>
          <div className="stat-label">Skills Missing</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{studentSkills?.length || 0}</div>
          <div className="stat-label">Your Skills</div>
        </div>
      </div>

      {/* Your Skills */}
      <div className="card card-body" style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '0.75rem' }}>Your Current Skills</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {studentSkills?.map((skill, i) => (
            <span key={i} className="skill-tag matched"><CheckCircle size={12} /> {skill}</span>
          ))}
        </div>
      </div>

      {/* Missing Skills */}
      {overallGap?.missingSkills?.length > 0 && (
        <div className="card card-body" style={{ marginBottom: '1.5rem', borderLeft: '3px solid var(--error-500)' }}>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--error-600)' }}>
            <AlertCircle size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }} />
            Missing Skills (Market Demand)
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
            These skills are frequently required by employers but missing from your profile.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {overallGap.missingSkills.map((skill, i) => (
              <span key={i} className="skill-tag missing">{skill}</span>
            ))}
          </div>
          <Link to="/student/trainings" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Find Training Programs <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Per-Job Gap Analysis */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h4>Job-Wise Skill Match</h4>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Match Score</th>
                <th>Matched</th>
                <th>Missing</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobGaps?.slice(0, 10).map((gap, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{gap.job.title}</td>
                  <td>{gap.job.companyName || 'N/A'}</td>
                  <td>
                    <span className={`match-score ${getMatchScoreClass(gap.matchScore)}`}>
                      {gap.matchScore}%
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {gap.matchedSkills?.map((s, j) => (
                        <span key={j} className="skill-tag matched" style={{ fontSize: '0.6875rem' }}>{s}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {gap.missingSkills?.map((s, j) => (
                        <span key={j} className="skill-tag missing" style={{ fontSize: '0.6875rem' }}>{s}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Link to={`/student/jobs/${gap.job._id}`} className="btn btn-ghost btn-sm">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SkillGapPage;
