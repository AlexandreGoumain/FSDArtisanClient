import { useEffect } from "react";
import { useLazyGetCurrentUserQuery } from "../store/api/authApi";
import { useAppSelector } from "../store/hooks";
import { selectIsAuthInitialized } from "../store/slices/authSlice";

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const isInitialized = useAppSelector(selectIsAuthInitialized);
    const [getCurrentUser] = useLazyGetCurrentUserQuery();

    useEffect(() => {
        if (!isInitialized) {
            getCurrentUser();
        }
    }, [isInitialized, getCurrentUser]);

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return <>{children}</>;
};
