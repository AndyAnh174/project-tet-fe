import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute; 