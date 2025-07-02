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
        // Si pas encore initialisé ET pas authentifié (via persistance)
        // Alors on vérifie l'auth côté serveur
        if (!isInitialized && !isAuthenticated) {
            getCurrentUser();
        }
        // Si l'état est persisté et qu'on est authentifié,
        // on peut quand même vérifier en arrière-plan (optionnel)
        else if (isInitialized && isAuthenticated) {
            // Vérification silencieuse en arrière-plan pour s'assurer que le token est toujours valide
            getCurrentUser();
        }
    }, [isInitialized, isAuthenticated, getCurrentUser]);

    // Si pas initialisé ET pas authentifié (premier chargement sans persistance)
    if (!isInitialized && !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return <>{children}</>;
};
