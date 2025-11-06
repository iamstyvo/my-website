import { useNavigate } from 'react-router-dom';
import '../App.css';

function FoundPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="content">
        <h1 className="welcome-header">Report Found Items</h1>
        <p className="page-description">
          Select the type of document you found to help return it to its owner.
        </p>
        
        <div className="services-grid">
          <div className="service-card">
            <h2>National ID</h2>
            <p>Report a National ID card you found to help return it to its owner.</p>
            <button 
              className="service-button" 
              onClick={() => navigate('/found-national-id')}
            >
              Report Found National ID
            </button>
          </div>
          
          <div className="service-card">
            <h2>Passport</h2>
            <p>Report a passport you found to help return it to its owner.</p>
            <button 
              className="service-button" 
              onClick={() => navigate('/found-passport')}
            >
              Report Found Passport
            </button>
          </div>
          
          <div className="service-card">
            <h2>Vehicle Permit</h2>
            <p>Report a vehicle permit you found to help return it to its owner.</p>
            <button 
              className="service-button" 
              onClick={() => navigate('/found-vehicle-permit')}
            >
              Report Found Vehicle Permit
            </button>
          </div>
          
          <div className="service-card">
            <h2>Land Documents</h2>
            <p>Report land documents you found to help return them to their owner.</p>
            <button 
              className="service-button" 
              onClick={() => navigate('/found-land-documents')}
            >
              Report Found Land Documents
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

export default FoundPage;