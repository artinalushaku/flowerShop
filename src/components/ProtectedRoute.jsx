import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    // Admin route but user is not admin
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'user' && !user.role) {
    // User route but no role specified
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 