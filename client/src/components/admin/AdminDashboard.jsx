import GuestList from './GuestListAdmin';
import React from 'react';
import { useEffect } from 'react';
import { isAdmin, isAuthenticated, logoutAdmin, removeToken } from '../../auth';
import { useNavigate } from 'react-router-dom';
import SummaryGuest from './SummaryGuest';

export default function AdminDashboard() {
    const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin() && !isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutAdmin();
    removeToken();
    navigate('/');
  };
  
  return (
    <>
      <main>
      <div className="container3">
        <h1>Admin Panel</h1>
        <GuestList />
      </div>
      </main>
    </>
  );
}
