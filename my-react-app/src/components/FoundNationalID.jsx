import { Link } from 'react-router-dom';
import '../App.css';

function FoundNationalID() {
  return (
    <div className="container">
      <div className="content">
        <h1>Report Found National ID</h1>
        <div className="service-details">
          <p>
            Thank you for taking the time to report a National ID you found. 
            By reporting found documents, you help reunite them with their rightful owners.
          </p>
          
          <div className="service-info">
            <h2>What you'll need:</h2>
            <ul>
              <li>Your contact information</li>
              <li>The ID number from the found document</li>
              <li>Location where you found the document</li>
              <li>Date when you found the document</li>
            </ul>
          </div>

          <div className="service-info">
            <h2>Process:</h2>
            <ol>
              <li>Fill out the reporting form with details about the found ID</li>
              <li>Submit the report to our system</li>
              <li>We'll attempt to match it with owners who reported their ID as lost</li>
              <li>If a match is found, we'll contact both parties to arrange return</li>
            </ol>
          </div>

          <div className="form-buttons">
            <Link to="/found-services" className="back-button">Back</Link>
            <Link to="/found-national-id-form" className="submit-button">Continue to Form</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoundNationalID;