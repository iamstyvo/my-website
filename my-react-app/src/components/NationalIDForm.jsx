import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addEntry } from './ReconcileStore';
import '../App.css';

function NationalIDForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    lostIDNumber: '',
    dateOfBirth: '',
    gender: '',
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
      docType: 'national id',
      fullName: formData.fullName,
      nationalId: formData.lostIDNumber,
      raw: {
        ...formData,
        // Use the base64 version for storage
        photo: formData.photoBase64
      },
      notes: `Lost on ${new Date().toISOString()}. DOB: ${formData.dateOfBirth}, Gender: ${formData.gender}`,
      userEmail: loggedInUser // Store user email if available
    });
    
    // Navigate to payment page
    navigate('/national-id-payment', { state: { formData } });
  };

  return (
    <div className="container">
      <div className="content">
        <h1>National ID Recovery Application</h1>
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
              <label htmlFor="lostIDNumber">Lost ID Number *</label>
              <input
                type="text"
                id="lostIDNumber"
                name="lostIDNumber"
                value={formData.lostIDNumber}
                onChange={handleChange}
                required
                placeholder="Enter your lost ID number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
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
              <Link to="/national-id" className="back-button">Back</Link>
              <button type="submit" className="submit-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NationalIDForm;