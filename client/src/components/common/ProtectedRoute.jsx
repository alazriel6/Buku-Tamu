// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAdmin, isAuthenticated } from '../../auth';

export default function ProtectedRoute({ children }) {
  if (!isAdmin() && !isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
