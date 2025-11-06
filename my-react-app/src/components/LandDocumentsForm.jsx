import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addEntry } from './ReconcileStore';
import '../App.css';

function LandDocumentsForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    plotNumber: '',
    registrationDate: '',
    landSize: '',
    landLocation: '',
    photo: null,
    photoBase64: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        // Also store the base64 data in form data for persistence
        setFormData(prev => ({
          ...prev,
          photoBase64: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get logged in user info
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    // Add entry to in-memory store
    addEntry({
      type: 'lost',
      docType: 'land documents',
      fullName: formData.fullName,
      nationalId: formData.nationalId,
      raw: {
        ...formData,
        // Use the base64 version for storage
        photo: formData.photoBase64
      },
      notes: `Lost on ${new Date().toISOString()}. Plot: ${formData.plotNumber}, Registration: ${formData.registrationDate}, Size: ${formData.landSize}, Location: ${formData.landLocation}`,
      userEmail: loggedInUser // Store user email if available
    });
    
    navigate('/land-documents-payment', { state: { formData } });
  };

  return (
    <div className="container">
      <div className="content">
        <h1>Land Documents Application</h1>
        <div className="service-details">
          <form onSubmit={handleSubmit} className="recovery-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
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

            <div className="form-group">
              <label htmlFor="nationalId">National ID Number *</label>
              <input
                type="text"
                id="nationalId"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                required
                placeholder="Enter your National ID number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="plotNumber">Plot Number *</label>
              <input
                type="text"
                id="plotNumber"
                name="plotNumber"
                value={formData.plotNumber}
                onChange={handleChange}
                required
                placeholder="Enter the plot number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="registrationDate">Date of Registration *</label>
              <input
                type="date"
                id="registrationDate"
                name="registrationDate"
                value={formData.registrationDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="landSize">Size of the Land *</label>
              <input
                type="text"
                id="landSize"
                name="landSize"
                value={formData.landSize}
                onChange={handleChange}
                required
                placeholder="e.g., 50 x 100 ft or 0.046 ha"
              />
            </div>

            <div className="form-group">
              <label htmlFor="landLocation">Location of the Land *</label>
              <input
                type="text"
                id="landLocation"
                name="landLocation"
                value={formData.landLocation}
                onChange={handleChange}
                required
                placeholder="Enter the land location"
              />
            </div>

            <div className="form-group">
              <label htmlFor="photo">Upload Your Photo *</label>
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
                required
              />
              {formData.photo && (
                <p className="file-name">Selected: {formData.photo.name}</p>
              )}
            </div>

            <div className="form-buttons">
              <Link to="/land-documents" className="back-button">Back</Link>
              <button type="submit" className="submit-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LandDocumentsForm;