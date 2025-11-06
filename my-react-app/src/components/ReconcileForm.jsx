import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { addEntry } from './ReconcileStore';

function ReconcileForm() {
  const navigate = useNavigate();
  const [docType, setDocType] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    contact: '',
    notes: ''
  });
  const [submittedId, setSubmittedId] = useState(null);

  const handleDocTypeChange = (e) => {
    setDocType(e.target.value);
    // Reset form when document type changes
    setFormData({
      fullName: '',
      nationalId: '',
      contact: '',
      notes: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to reconciliation store
    const id = addEntry({
      type: 'lost', // This form is for reporting lost items
      fullName: formData.fullName,
      nationalId: formData.nationalId,
      docType: docType,
      contact: formData.contact,
      notes: formData.notes,
      raw: formData
    });
    
    setSubmittedId(id);
  };

  const handleReset = () => {
    setDocType('');
    setFormData({
      fullName: '',
      nationalId: '',
      contact: '',
      notes: ''
    });
    setSubmittedId(null);
  };

  if (submittedId) {
    return (
      <div className="container">
        <div className="content">
          <h1>Report Submitted Successfully!</h1>
          <div className="success-message">
            <p>Your lost document report has been submitted.</p>
            <p><strong>Reference ID: {submittedId}</strong></p>
            <p>We will attempt to find a match in our system and contact you if we find anything.</p>
            
            <div className="navigation-buttons">
              <button onClick={handleReset} className="continue-button">
                Report Another Document
              </button>
              <Link to="/reconciliation" className="submit-button">
                Go to Reconciliation Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="content">
        <h1>Report Lost Document</h1>
        <p className="page-description">
          Please provide details about your lost document to help us 
          locate it among found items.
        </p>
        
        <div className="service-details">
          <form onSubmit={handleSubmit} className="recovery-form">
            <div className="form-group">
              <label htmlFor="docType">Document Type *</label>
              <select
                id="docType"
                value={docType}
                onChange={handleDocTypeChange}
                required
              >
                <option value="">Select document type</option>
                <option value="national id">National ID</option>
                <option value="passport">Passport</option>
                <option value="vehicle permit">Vehicle Permit</option>
                <option value="land documents">Land Documents</option>
              </select>
            </div>

            {docType && (
              <>
                <div className="form-group">
                  <label htmlFor="fullName">Your Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                {(docType === 'national id' || docType === 'passport') && (
                  <div className="form-group">
                    <label htmlFor="nationalId">
                      {docType === 'national id' ? 'National ID Number' : 'Passport Number'} *
                    </label>
                    <input
                      type="text"
                      id="nationalId"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleChange}
                      required
                      placeholder={`Enter your ${docType === 'national id' ? 'ID number' : 'passport number'}`}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="contact">Your Contact Information *</label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    placeholder="Phone number or email where we can reach you"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Additional Details</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Provide any additional details that might help identify your document..."
                  ></textarea>
                </div>

                <div className="form-buttons">
                  <Link to="/services" className="back-button">Back</Link>
                  <button type="submit" className="submit-button">Submit Report</button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReconcileForm;