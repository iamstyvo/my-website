import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function ChoicePage() {
  const [userChoice, setUserChoice] = useState('');
  const navigate = useNavigate();

  const handleChoiceSelect = (choice) => {
    setUserChoice(choice);
  }

  const handleContinue = () => {
    if (userChoice === 'lost') {
      navigate('/lost');
    } else if (userChoice === 'found') {
      navigate('/found');
    } else if (userChoice === 'see') {
      navigate('/see-everything');
    }
  }

  return (
    <div className="container">
      <div className="content">
        <h1 className="welcome-header">What would you like to do?</h1>
        
        <div className="choice-options">
          <div 
            className={`choice-card ${userChoice === 'lost' ? 'selected' : ''}`}
            onClick={() => handleChoiceSelect('lost')}
          >
            <h3>I Lost Something</h3>
            <p>Report a lost document and start the recovery process</p>
          </div>
          <div
          className={`choice-card ${userChoice === 'see' ? 'selected' : ''}`}
            onClick={() => handleChoiceSelect('see')}
           >
              <h3>See Everything</h3>
              <p>View all reports and manage the system</p>
              </div>
          <div 
            className={`choice-card ${userChoice === 'found' ? 'selected' : ''}`}
            onClick={() => handleChoiceSelect('found')}
          >
            <h3>I Found Something</h3>
            <p>Report an item you found to help return it to its owner</p>
          </div>
        </div>
        
        {userChoice && (
          <button className="continue-button" onClick={handleContinue}>
            Continue
          </button>
        )}
        
        <div className="navigation-buttons">
          <button onClick={() => navigate('/')} className="back-button">
            Back to Instructions
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChoicePage;