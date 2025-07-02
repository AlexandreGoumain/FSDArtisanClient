import { useEffect } from "react";
import { useLazyGetMeUserQuery } from "../store/api/usersApi";
import { useAppSelector } from "../store/hooks";
import {
    selectIsAuthInitialized,
    selectIsAuthenticated,
} from "../store/slices/authSlice";

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const isInitialized = useAppSelector(selectIsAuthInitialized);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const [getCurrentUser] = useLazyGetMeUserQuery();

    useEffect(() => {
        if (!isInitialized && !isAuthenticated) {
            getCurrentUser();
        } else if (isInitialized && isAuthenticated) {
            getCurrentUser();
        }
    }, [isInitialized, isAuthenticated, getCurrentUser]);

    if (!isInitialized && !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return <>{children}</>;
};
