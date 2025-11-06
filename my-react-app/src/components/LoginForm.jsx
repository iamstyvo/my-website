import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simple validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    // Simulate login process
    setTimeout(() => {
      // For demo purposes, we'll accept the specific credentials
      // In a real application, you would validate against a database
      if (formData.username === 'styvo' && formData.password === 'styvo100@') {
        // Store the user info
        localStorage.setItem('loggedInUser', formData.username);
        localStorage.setItem('token', 'demo-token-' + Date.now());
        setLoading(false);
        // Redirect to Total Reports page
        navigate('/total-reports');
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="container">
      <div className="content">
        <h1>Admin Login</h1>
        <p className="page-description">
          Access the total reports and manage all submissions.
        </p>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <div className="form-buttons">
              <Link to="/" className="back-button">Back</Link>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;