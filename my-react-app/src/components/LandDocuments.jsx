import { Link } from 'react-router-dom';
import '../App.css';

function LandDocuments() {
  return (
    <div className="container">
      <div className="content">
        <h1>Land Documents Recovery</h1>
        <div className="service-details">
          <h2>How to Get Your Lost Land Documents</h2>
          <ol className="steps-list">
            <li>File a police report for the lost documents</li>
            <li>Visit the land registry office</li>
            <li>Submit an application for duplicate documents</li>
            <li>Provide proof of ownership and identity</li>
            <li>Pay the required fees</li>
            <li>Collect your replacement documents</li>
          </ol>
          <div className="navigation-buttons">
            <Link to="/land-documents-form" className="continue-button">Continue to Application</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandDocuments;