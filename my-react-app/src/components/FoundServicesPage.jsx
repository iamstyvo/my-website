import { Link } from 'react-router-dom';
import '../App.css';

function FoundServicesPage() {
  return (
    <div className="container">
      <div className="content">
        <h1>Found Document Reporting Services</h1>
        <p className="page-description">
          Select the type of document you found to begin the reporting process.
          We'll help connect you with the rightful owner.
        </p>
        <div className="services-grid">
          <div className="service-card">
            <h2>National ID</h2>
            <p>Report a national identification card you found</p>
            <Link to="/found-national-id" className="service-button">
              Report
            </Link>
          </div>

          <div className="service-card">
            <h2>Passport</h2>
            <p>Report a passport you found</p>
            <Link to="/found-passport" className="service-button">
              Report
            </Link>
          </div>

          <div className="service-card">
            <h2>Vehicle Permit</h2>
            <p>Report a vehicle permit you found</p>
            <Link to="/found-vehicle-permit" className="service-button">
              Report
            </Link>
          </div>

          <div className="service-card">
            <h2>Land Documents</h2>
            <p>Report land documents you found</p>
            <Link to="/found-land-documents" className="service-button">
              Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoundServicesPage;