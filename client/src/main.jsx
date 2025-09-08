import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './components/auth/Login';
import GuestList from './components/user/GuestListPublic';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import About from './components/common/About';
import AdminDashboard from './components/admin/AdminDashboard';
import SummaryGuest from './components/admin/SummaryGuest';
import ProtectedRoute from './components/common/ProtectedRoute';
import Contact from './components/common/Contact';
import Register from './components/auth/Register';
import MainLayout from './MainLayout';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Semua route yang butuh Navbar + Footer masuk ke MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/guests" element={<GuestList />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/summary"
            element={
              <ProtectedRoute>
                <SummaryGuest />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Route tanpa Navbar & Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  </React.StrictMode>
);
