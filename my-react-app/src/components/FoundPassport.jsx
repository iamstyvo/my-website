import { Link } from 'react-router-dom';
import '../App.css';

function FoundPassport() {
  return (
    <div className="container">
      <div className="content">
        <h1>Report Found Passport</h1>
        <div className="service-details">
          <p>
            Thank you for taking the time to report a passport you found. 
            Passports are important travel documents, and returning them quickly 
            helps travelers avoid significant inconvenience.
          </p>
          
          <div className="service-info">
            <h2>What you'll need:</h2>
            <ul>
              <li>Your contact information</li>
              <li>The passport number from the found document</li>
              <li>Location where you found the document</li>
              <li>Date when you found the document</li>
            </ul>
          </div>

          <div className="service-info">
            <h2>Process:</h2>
            <ol>
              <li>Fill out the reporting form with details about the found passport</li>
              <li>Submit the report to our system</li>
              <li>We'll attempt to match it with owners who reported their passport as lost</li>
              <li>If a match is found, we'll contact both parties to arrange return</li>
            </ol>
          </div>

          <div className="form-buttons">
            <Link to="/found-services" className="back-button">Back</Link>
            <Link to="/found-passport-form" className="submit-button">Continue to Form</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoundPassport;