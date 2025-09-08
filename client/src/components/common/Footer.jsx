import React from 'react';
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import '../../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Buku Tamu. All rights reserved.</p>
        <div className="social-icons">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" title="GitHub">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer" title="Website">
            <FaGlobe />
          </a>
        </div>
      </div>
    </footer>
  );
}
