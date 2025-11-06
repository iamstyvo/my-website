import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { addEntry } from './ReconcileStore';
import '../App.css';

function LandDocumentsPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [payerName, setPayerName] = useState('');

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'mobile-money') {
      setShowPaymentDetails(true);
    } else {
      setPaymentComplete(true);
    }
  };

  const handleMobileMoneyPayment = (e) => {
    e.preventDefault();
    // Add entry to in-memory store with payment information
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    addEntry({
      type: 'lost',
      docType: 'land documents',
      fullName: formData.fullName,
      raw: {
        ...formData,
        documentTitle: `Land Document - Plot ${formData.plotNumber}`,
        paymentMethod: 'mobile-money',
        payerName: payerName,
        paymentPhoneNumber: '0798437286',
        paymentReceiverName: 'Niyonzimasteven'
      },
      notes: `Lost on ${new Date().toISOString()}. Plot: ${formData.plotNumber}, Size: ${formData.landSize}, Location: ${formData.landLocation}. Paid via Mobile Money by ${payerName}`,
      userEmail: loggedInUser // Store user email if available
    });
    
    setPaymentComplete(true);
  };

  if (!formData) {
    return (
      <div className="container">
        <div className="content">
          <h1>Error</h1>
          <p>No application data found. Please fill out the form first.</p>
          <Link to="/land-documents-form" className="back-button">Go to Form</Link>
        </div>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="container">
        <div className="content">
          <h1>Payment Successful!</h1>
          <div className="service-details">
            <div className="success-message">
              <p>Thank you for your payment. Your land documents application has been submitted.</p>
              <p>You will receive a confirmation email shortly with further instructions.</p>
            </div>
            <div className="navigation-buttons">
              <Link to="/" className="continue-button">Go to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showPaymentDetails) {
    return (
      <div className="container">
        <div className="content">
          <h1>Mobile Money Payment</h1>
          <div className="service-details">
            <div className="application-summary">
              <h2>Payment Details</h2>
              <p><strong>Amount:</strong> $30.00</p>
              <p><strong>Phone Number:</strong> 0798437286</p>
              <p><strong>Receiver Name:</strong> Niyonzimasteven</p>
            </div>
            
            <form onSubmit={handleMobileMoneyPayment} className="payment-form">
              <div className="form-group">
                <label htmlFor="payerName">Your Full Name *</label>
                <input
                  type="text"
                  id="payerName"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="payment-amount">
                <h3>Total Amount: $30.00</h3>
              </div>
              
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="back-button" 
                  onClick={() => setShowPaymentDetails(false)}
                >
                  Back
                </button>
                <button type="submit" className="submit-button" disabled={!payerName}>
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="content">
        <h1>Payment for Land Documents</h1>
        <div className="service-details">
          <div className="application-summary">
            <h2>Application Summary</h2>
            <p><strong>Full Name:</strong> {formData.fullName}</p>
            <p><strong>National ID Number:</strong> {formData.nationalId}</p>
            <p><strong>Plot Number:</strong> {formData.plotNumber}</p>
            <p><strong>Date of Registration:</strong> {formData.registrationDate}</p>
            <p><strong>Size of the Land:</strong> {formData.landSize}</p>
            <p><strong>Location of the Land:</strong> {formData.landLocation}</p>
          </div>

          <form onSubmit={handlePaymentSubmit} className="payment-form">
            <h2>Select Payment Method</h2>

            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mobile-money"
                  checked={paymentMethod === 'mobile-money'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                />
                <span>Mobile Money</span>
              </label>
            </div>

            <div className="payment-amount">
              <h3>Total Amount: $30.00</h3>
            </div>

            <div className="form-buttons">
              <Link to="/land-documents-form" className="back-button">Back to Form</Link>
              <button type="submit" className="submit-button" disabled={!paymentMethod}>
                Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LandDocumentsPayment;