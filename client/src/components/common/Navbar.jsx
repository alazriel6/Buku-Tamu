import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAdmin, isAuthenticated, logoutAdmin, removeToken } from '../../auth';
import '../../styles/Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutAdmin();
    removeToken();
    navigate('/');
  };

  const adminLoggedIn = isAdmin() || isAuthenticated();

  return (
    <nav className="nav">
      <div className="container2">
        <div className="left">
          <h1 className="title"><a href="/" className='Home'>📘 Buku Tamu </a> </h1>
        </div>

        <button className="hamburger" onClick={toggleMenu}> ☰ </button>

        <ul className={`nav-list ${isOpen ? 'open' : ''}`}>
          {!adminLoggedIn ? (
            <>
              <li className={location.pathname === '/' ? 'active' : ''}>
                <a href="/">Home</a>
              </li>
              <li className={location.pathname === '/About' ? 'active' : ''}>
                <a href="/About">About</a>
              </li>
              <li className={location.pathname === '/contact' ? 'active' : ''}>
                <a href="/contact">Contact</a>
              </li>
            </>
          ) : (
            <>
              <li className={location.pathname === '/admin' ? 'active' : ''}>
                <a href="/admin">Dashboard Admin</a>
              </li>
              <li className={location.pathname === '/admin/summary' ? 'active' : ''}>
                <a href="/admin/summary">Summary Guest</a>
              </li>
              <li
                 className="logout" onClick={handleLogout}>
                  Logout
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
