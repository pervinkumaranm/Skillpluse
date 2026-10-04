import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const MetricDetails = () => {
  const { metric } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configuration for each metric type
  const config = {
    'total-students': {
      title: 'Total Students',
      columns: ['Student ID', 'Name', 'District', 'Skills', 'Training Status', 'Employment Status'],
      dataKey: 'students'
    },
    'training-centres': {
      title: 'Training Centres',
      columns: ['Centre Name', 'District', 'Courses Offered', 'Number of Students', 'Centre Status'],
      dataKey: 'centres'
    },
    'employers': {
      title: 'Employers',
      columns: ['Employer/Company Name', 'Industry', 'Location', 'Jobs Available', 'Hired Students'],
      dataKey: 'employers'
    },
    'enrolled': {
      title: 'Enrolled Students',
      columns: ['Student Name', 'Program', 'Training Centre', 'Enrollment Date', 'Training Status'],
      dataKey: 'enrolled'
    },
    'completed-training': {
      title: 'Completed Training',
      columns: ['Student', 'Program', 'Completion Date', 'Score/Status', 'Certificate Status'],
      dataKey: 'completed'
    },
    'completion-rate': {
      title: 'Completion Rate Analysis',
      columns: ['Program', 'Total Enrolled', 'Completed', 'Completion Percentage', 'District'],
      dataKey: 'completionRates'
    },
    'certified': {
      title: 'Certified Students',
      columns: ['Student', 'Certification/Program', 'Certificate ID', 'Issue Date', 'Verification Status'],
      dataKey: 'certified'
    },
    'employed': {
      title: 'Employed Candidates',
      columns: ['Student', 'Employer', 'Job Role', 'District', 'Joining Date'],
      dataKey: 'employed'
    },
    'verified-employment': {
      title: 'Verified Employment',
      columns: ['Student', 'Employer', 'Job Role', 'Verification Status', 'Verification Date'],
      dataKey: 'verified'
    },
    'employment-rate': {
      title: 'Employment Rate Analysis',
      columns: ['District/Skill', 'Total Trained', 'Employed', 'Employment Percentage', 'Status'],
      dataKey: 'employmentRates'
    },
    'active-programs': {
      title: 'Active Programs',
      columns: ['Program Name', 'Training Centre', 'Duration', 'Enrolled Students', 'Program Status'],
      dataKey: 'programs'
    },
    'active-jobs': {
      title: 'Active Jobs',
      columns: ['Job Title', 'Employer', 'Location', 'Required Skills', 'Vacancies', 'Application Status'],
      dataKey: 'jobs'
    }
  };

  const currentConfig = config[metric] || { title: 'Details', columns: ['Data'] };

  useEffect(() => {
    // Simulate fetching details from API
    // Since there are no specific detailed APIs for government overview in the backend yet,
    // we use detailed demo data specifically structured for this metric.
    setLoading(true);
    setTimeout(() => {
      setData(generateDemoData(metric));
      setLoading(false);
    }, 500);
  }, [metric]);

  const generateDemoData = (type) => {
    // Generate 10 rows of demo data matching the columns
    const rows = [];
    for (let i = 1; i <= 10; i++) {
      if (type === 'total-students') {
        rows.push(['STU2026' + i, `Student ${i}`, ['Mumbai', 'Pune', 'Nagpur'][i%3], 'React, Node.js', 'Completed', 'Employed']);
      } else if (type === 'training-centres') {
        rows.push([`Skill Centre ${i}`, ['Thane', 'Nashik', 'Pune'][i%3], i + 2, 100 * i, 'Active']);
      } else if (type === 'employers') {
        rows.push([`Tech Company ${i}`, 'IT / Software', 'Pune', i * 5, i * 2]);
      } else if (type === 'enrolled') {
        rows.push([`Student ${i}`, 'Full Stack Web Dev', `Centre ${i}`, `2026-0${1+(i%9)}-10`, 'In Progress']);
      } else if (type === 'completed-training') {
        rows.push([`Student ${i}`, 'Data Analytics', `2026-10-0${i}`, '85%', 'Issued']);
      } else if (type === 'completion-rate') {
        rows.push([`Program ${i}`, 200 + i*10, 150 + i*5, `${75 + (i%20)}%`, 'Mumbai']);
      } else if (type === 'certified') {
        rows.push([`Student ${i}`, 'Python Basics', `CERT-${1000+i}`, `2026-10-0${i}`, 'Verified']);
      } else if (type === 'employed') {
        rows.push([`Student ${i}`, `Employer ${i}`, 'Software Engineer', 'Pune', `2026-11-0${i}`]);
      } else if (type === 'verified-employment') {
        rows.push([`Student ${i}`, `Company ${i}`, 'Data Scientist', 'Verified', `2026-10-1${i}`]);
      } else if (type === 'employment-rate') {
        rows.push([['Mumbai', 'Pune', 'Nashik'][i%3], 500 + i*100, 400 + i*80, `${80 + (i%15)}%`, 'Excellent']);
      } else if (type === 'active-programs') {
        rows.push([`Advanced Training ${i}`, `Institute ${i}`, '6 Months', 45 + i, 'Active']);
      } else if (type === 'active-jobs') {
        rows.push([`Software Engineer ${i}`, `Tech Corp ${i}`, 'Mumbai', 'React, JS', 2 + i, 'Open']);
      } else {
        rows.push(['Demo Data ' + i]);
      }
    }
    return rows;
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/government/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1>{currentConfig.title}</h1>
          <p>Detailed view and analytics for {currentConfig.title.toLowerCase()}.</p>
        </div>
      </div>

      <div style={{
        background: 'var(--primary-50)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)',
        border: '1px solid var(--primary-100)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
        fontSize: '0.8125rem', color: 'var(--primary-700)', fontWeight: 500,
      }}>
        <AlertCircle size={16} /> Data shown below is <strong>Demo Data</strong> as the detailed API for this metric is not yet integrated.
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-container" style={{ padding: '3rem' }}>
            <div className="spinner"></div>
            <p>Loading {currentConfig.title} data...</p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {currentConfig.columns.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricDetails;
