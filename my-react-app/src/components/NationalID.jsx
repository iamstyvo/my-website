import { Link } from 'react-router-dom';
import '../App.css';

function NationalID() {
  return (
    <div className="container">
      <div className="content">
        <h1>National ID Recovery Process</h1>
        <div className="service-details">
          <h2>How to Get Your National ID</h2>
          <ol className="steps-list">
            <li>Visit your nearest National Registration Bureau</li>
            <li>Fill out the ID replacement form</li>
            <li>Provide proof of identity (birth certificate, affid)</li>
            <li>Pay the replacement fee</li>
            <li>Collect your new ID within the specified timeframe</li>
          </ol>
          <div className="navigation-buttons">
            <Link to="/national-id-form" className="continue-button">Continue to Application</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NationalID;