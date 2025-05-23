// components/ProtectedRoute.js
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase-config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../firebase/firebase-config";

const ProtectedRoute = ({ children, requiredRole }) => {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            if (!loading && !user) {
                navigate('/');
                return;
            }

            if (user) {
                const role = await getUserRole(user.uid);
                if (role !== requiredRole) {
                    navigate('/');
                }
            }
        };

        verifyUser();
    }, [user, loading, navigate, requiredRole]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return user ? children : null;
};

export default ProtectedRoute;