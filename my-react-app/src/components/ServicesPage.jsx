import { Link } from 'react-router-dom';
import '../App.css';

function ServicesPage() {
  return (
    <div className="container">
      <div className="content">
        <h1>Lost Document Recovery Services</h1>
        <p className="page-description">
          Select the type of document you lost to begin the recovery process.
          We'll help guide you through the steps to get it back.
        </p>
        <div className="services-grid">
          <div className="service-card">
            <h2>National ID</h2>
            <p>Learn how to recover your lost national identification card</p>
            <Link to="/national-id" className="service-button">
              Continue
            </Link>
          </div>

          <div className="service-card">
            <h2>Passport</h2>
            <p>Get help with your lost passport recovery process</p>
            <Link to="/passport" className="service-button">
              Continue
            </Link>
          </div>

          <div className="service-card">
            <h2>Vehicle Permit</h2>
            <p>Recover your lost vehicle permit documents</p>
            <Link to="/vehicle-permit" className="service-button">
              Continue
            </Link>
          </div>

          <div className="service-card">
            <h2>Land Documents</h2>
            <p>Get assistance with lost land documentation</p>
            <Link to="/land-documents" className="service-button">
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;