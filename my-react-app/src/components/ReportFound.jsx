import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function ReportFound() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new found services page
    navigate('/found-services');
  }, [navigate]);

  return (
    <div className="container">
      <div className="content">
        <h1>Redirecting...</h1>
        <p>If you are not redirected automatically, please <a href="/found-services">click here</a>.</p>
      </div>
    </div>
  );
}

export default ReportFound;
