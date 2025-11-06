import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addEntry } from './ReconcileStore';
import '../App.css';

function FoundNationalIDForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    finderName: '',
    finderContact: '',
    foundIDNumber: '',
    foundLocation: '',
    foundDate: '',
    notes: '',
    photo: null,
    photoBase64: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submittedId, setSubmittedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store both the file for preview and base64 for persistence
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        // Also store the base64 data in form data for persistence
        setFormData(prev => ({
          ...prev,
          photoBase64: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Add entry to in-memory store
      const entryId = addEntry({
        type: 'found',
        docType: 'national id',
        fullName: formData.finderName,
        nationalId: formData.foundIDNumber,
        raw: {
          ...formData,
          // Use the base64 version for storage
          photo: formData.photoBase64
        },
        notes: `Found at ${formData.foundLocation} on ${formData.foundDate}. ${formData.notes}`
      });
      
      setSubmittedId(entryId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      finderName: '',
      finderContact: '',
      foundIDNumber: '',
      foundLocation: '',
      foundDate: '',
      notes: '',
      photo: null,
      photoBase64: null
    });
    setPhotoPreview(null);
    setSubmittedId(null);
    setError(null);
  };

  if (submittedId) {
    return (
      <div className="container">
        <div className="content">
          <h1>Thank You for Reporting!</h1>
          <div className="success-message">
            <p>Your report has been submitted successfully.</p>
            <p><strong>Reference ID: {submittedId}</strong></p>
            <p>We will attempt to match this found document with its owner.</p>
            
            <div className="navigation-buttons">
              <button onClick={handleReset} className="continue-button">
                Report Another Document
              </button>
              {/* Removed navigation to Reconciliation Center */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="content">
        <h1>Report Found National ID</h1>
        <p className="page-description">
          Please provide details about the National ID you found to help us 
          connect it with its rightful owner.
        </p>
        
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="service-details">
          <form onSubmit={handleSubmit} className="recovery-form">
            <div className="form-group">
              <label htmlFor="finderName">Your Full Name *</label>
              <input
                type="text"
                id="finderName"
                name="finderName"
                value={formData.finderName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="finderContact">Your Contact Information *</label>
              <input
                type="text"
                id="finderContact"
                name="finderContact"
                value={formData.finderContact}
                onChange={handleChange}
                required
                placeholder="Phone number or email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="foundIDNumber">Found ID Number *</label>
              <input
                type="text"
                id="foundIDNumber"
                name="foundIDNumber"
                value={formData.foundIDNumber}
                onChange={handleChange}
                required
                placeholder="Enter the ID number from the found document"
              />
            </div>

            <div className="form-group">
              <label htmlFor="foundLocation">Where Did You Find It? *</label>
              <input
                type="text"
                id="foundLocation"
                name="foundLocation"
                value={formData.foundLocation}
                onChange={handleChange}
                required
                placeholder="Location where the document was found"
              />
            </div>

            <div className="form-group">
              <label htmlFor="foundDate">Date Found *</label>
              <input
                type="date"
                id="foundDate"
                name="foundDate"
                value={formData.foundDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="photo">Photo of Found Document</label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              {photoPreview && (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }} />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Any additional details about the found document..."
              ></textarea>
            </div>

            <div className="form-buttons">
              <Link to="/found-services" className="back-button">Back</Link>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FoundNationalIDForm;