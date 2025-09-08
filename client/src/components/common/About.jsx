// src/components/About.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import pkg from '../../../package.json'; // sesuaikan path relatif ke package.json
import '../../styles/About.css';

const About = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const appVersion = pkg.version; // gunakan versi dari package.json

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    setIsAdmin(!!adminToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
  };

  return (
    <div className="about-container">
      <h1>Guest Book Application</h1>
      <p>This is a simple Guest Book application — my first React app.</p>
      <p>Version: {appVersion}</p>
      <p>Developed by: Jacob</p>
      {isAdmin && (
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default About;
