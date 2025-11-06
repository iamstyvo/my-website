import { useNavigate } from 'react-router-dom';
import '../App.css';

function LostPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="content">
        <h1 className="welcome-header">Report Lost Items</h1>
        <p className="page-description">
          Select the type of document you lost to begin the recovery process.
        </p>
        
        <div className="services-grid">
          <div className="service-card">
            <h2>National ID</h2>
            <p>Report a lost National ID card and start the replacement process.</p>
            <button 
              className="service-button" 
              onClick={() => navigate('/national-id')}
            >
              Report Lost National ID
            </button>
          </div>
          
          <div className="service-card">
            <h2>Passport</h2>
            <p>Report a lost passport and begin the process for a replacement.</p>
            <button 
              className="service-button" 
              onClick={() => navigate('/passport')}
            >
              Report Lost Passport
            </button>
          </div>
          
          <div className="service-card">
            <h2>Vehicle Permit</h2>
            <p>Report a lost vehicle permit and start the renewal process.</p>
            <button 
              className="service-button" 
              onClick={() => navigate('/vehicle-permit')}
            >
              Report Lost Vehicle Permit
            </button>
          </div>
          
          <div className="service-card">
            <h2>Land Documents</h2>
            <p>Report lost land ownership documents and begin recovery steps.</p>
            <button 
              className="service-button" 
              onClick={() => navigate('/land-documents')}
            >
              Report Lost Land Documents
            </button>
          </div>
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

export default LostPage;