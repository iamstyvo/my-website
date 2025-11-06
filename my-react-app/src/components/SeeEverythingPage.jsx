import { useNavigate } from 'react-router-dom';
import '../App.css';

function SeeEverythingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="welcome-header">View All Reports</h1>
        <p className="page-description">
          Access the complete system to view all lost and found reports, manage submissions, 
          and reconcile matching items.
        </p>
        
        <div className="service-card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <h2>Administrator Access</h2>
          <p>
            To view all reports and manage the system, you need to log in with administrative credentials.
            This section provides access to all submitted reports, matching pairs, and system management tools.
          </p>
          <button 
            className="service-button" 
            onClick={handleLogin}
            style={{ width: '100%', padding: '1rem' }}
          >
            Proceed to Login
          </button>
        </div>
        
        <div className="navigation-buttons">
          <button onClick={() => navigate('/choice')} className="back-button">
            Back to Options
          </button>
        </div>
      </div>
    </div>
  )
}

export default SeeEverythingPage;