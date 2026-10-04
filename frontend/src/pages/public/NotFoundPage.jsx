import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--gray-50)',
    textAlign: 'center',
    padding: '2rem',
  }}>
    <div style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--primary-200)', lineHeight: 1 }}>404</div>
    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', marginTop: '1rem' }}>Page Not Found</h1>
    <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', maxWidth: '400px' }}>
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <Link to="/" className="btn btn-primary"><Home size={16} /> Go Home</Link>
      <button onClick={() => window.history.back()} className="btn btn-secondary"><ArrowLeft size={16} /> Go Back</button>
    </div>
  </div>
);

export default NotFoundPage;
