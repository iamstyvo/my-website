import { Link } from 'react-router-dom';
import '../App.css';

function VehiclePermit() {
  return (
    <div className="container">
      <div className="content">
        <h1>Vehicle Permit Recovery</h1>
        <div className="service-details">
          <h2>How to Get Your Lost Vehicle Permit</h2>
          <ol className="steps-list">
            <li>Report the lost permit to local transport authority</li>
            <li>Fill out the vehicle permit replacement form</li>
            <li>Provide vehicle registration details</li>
            <li>Submit proof of ownership</li>
            <li>Pay the replacement fee</li>
            <li>Collect your new permit</li>
          </ol>
          <div className="navigation-buttons">
            <Link to="/vehicle-permit-form" className="continue-button">Continue to Application</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehiclePermit;