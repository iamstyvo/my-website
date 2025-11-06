import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { addEntry } from './ReconcileStore';
import '../App.css';

function VehiclePermitPayment() {
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
      docType: 'vehicle permit',
      fullName: formData.fullName,
      raw: {
        ...formData,
        permitNumber: formData.permitIDNumber,
        paymentMethod: 'mobile-money',
        payerName: payerName,
        paymentPhoneNumber: '0798437286',
        paymentReceiverName: 'Niyonzimasteven'
      },
      notes: `Lost on ${new Date().toISOString()}. DOB: ${formData.dateOfBirth}, Gender: ${formData.gender}, Vehicle Type: ${formData.vehicleType}. Paid via Mobile Money by ${payerName}`,
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
          <Link to="/vehicle-permit-form" className="back-button">Go to Form</Link>
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
              <p>Thank you for your payment. Your Vehicle Permit recovery application has been submitted.</p>
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
              <p><strong>Amount:</strong> $50.00</p>
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
                <h3>Total Amount: $50.00</h3>
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
        <h1>Payment for Vehicle Permit Recovery</h1>
        <div className="service-details">
          <div className="application-summary">
            <h2>Application Summary</h2>
            <p><strong>Full Name:</strong> {formData.fullName}</p>
            <p><strong>Permit ID Number:</strong> {formData.permitIDNumber}</p>
            <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
            <p><strong>Vehicle Type:</strong> {formData.vehicleType === 'car' ? 'Car Vehicle' : 'Motor Vehicle'}</p>
            <p><strong>Photo:</strong> {formData.photo?.name || 'Uploaded'}</p>
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
              <h3>Total Amount: $50.00</h3>
            </div>

            <div className="form-buttons">
              <Link to="/vehicle-permit-form" className="back-button">Back to Form</Link>
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

export default VehiclePermitPayment;