import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';

export default function UserProtectedRoute({ children }) {
    const { isLoggedIn } = useUserAuth();
    if (!isLoggedIn) {
        return <Navigate to="/user-login" replace />;
    }
    return children;
}