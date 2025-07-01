import { useLocation, useNavigate, useParams } from "react-router-dom";

export const useRouting = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    // Récupérer le chemin actuel
    const currentPath = location.pathname;

    // Récupérer le chemin avec les query params
    const currentFullPath = location.pathname + location.search;

    // Vérifier si on est sur une route spécifique
    const isOnRoute = (path: string) => currentPath === path;

    // Vérifier si on est sur une route qui commence par un chemin donné
    const isOnRouteStartingWith = (basePath: string) =>
        currentPath.startsWith(basePath);

    // Navigation programmatique
    const goTo = (path: string) => navigate(path);
    const goBack = () => navigate(-1);
    const goForward = () => navigate(1);

    return {
        // Informations sur la route actuelle
        currentPath,
        currentFullPath,
        location,
        params,

        // Fonctions utilitaires
        isOnRoute,
        isOnRouteStartingWith,

        // Navigation
        goTo,
        goBack,
        goForward,
        navigate,
    };
};
