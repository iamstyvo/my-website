import { Link } from 'react-router-dom';
import '../App.css';

function Passport() {
  return (
    <div className="container">
      <div className="content">
        <h1>Lost Passport Recovery</h1>
        <div className="service-details">
          <h2>How to Get Your Lost Passport</h2>
          <ol className="steps-list">
            <li>File a police report for the lost passport</li>
            <li>Visit the passport office website to schedule an appointment</li>
            <li>Fill out the passport replacement application</li>
            <li>Provide necessary documentation (birth certificate, ID)</li>
            <li>Pay the replacement fee</li>
            <li>Attend the scheduled appointment</li>
          </ol>
          <div className="navigation-buttons">
            <Link to="/passport-form" className="continue-button">Continue to Application</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Passport;