import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function WelcomePage() {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [hasReadInstructions, setHasReadInstructions] = useState(false);
  const navigate = useNavigate();

  const handleAgree = () => {
    setHasAgreed(true);
    // Navigate to the choice page after agreeing
    navigate('/choice');
  }

  return (
    <div className="container">
      <div className="content">
        <h1 className="welcome-header">Urakaza neza aho wabona ibya ngobwa byawe</h1>
        
        <div className="instructions">
          <h2>Ibintu ugomba kwemeza :</h2>
          <ol>
            <li>Kuzuza ibisabwa bitewe nicyo ugiye gukora haba ari bantu bashaka ibya ngobwa byabo <br />
               no kubantu bari kuragisha .</li>
            <li></li>
            <li>Respect the privacy and rights of other users.</li>
            <li>Do not share sensitive personal information publicly.</li>
          </ol>
        </div>

        <div className="confirmation-section">
          <label className="radio-label">
            <input 
              type="radio" 
              name="readConfirmation" 
              onChange={(e) => setHasReadInstructions(e.target.checked)}
              checked={hasReadInstructions}
            />
            <span>I confirm that I have read and understood the instructions above</span>
          </label>
        </div>

        <button 
          className="agree-button" 
          onClick={handleAgree}
          disabled={!hasReadInstructions}
        >
          I Agree to the Instructions
        </button>
      </div>
    </div>
  )
}

export default WelcomePage;