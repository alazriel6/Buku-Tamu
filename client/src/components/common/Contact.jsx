import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAdmin, isAuthenticated, logoutAdmin, removeToken } from '../../auth';
import React from 'react';
import '../../styles/Contact.css';

export default function Contact() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    setIsAdmin(!!adminToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>For Feedback or Support, please contact us:</p>
      <p>Phone: +628214424921</p>
      <p>Email: boylazy801@gmail.com</p>
      {isAdmin && (
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
}
