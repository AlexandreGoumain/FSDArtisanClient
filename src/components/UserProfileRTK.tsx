import { Terminal } from "lucide-react";
import { useAuth } from "../hooks/useAuthRTK";
import { useAppSelector } from "../store/hooks";
import {
    selectCurrentUser,
    selectIsAuthenticated,
} from "../store/slices/authSlice";
import { Error } from "./Error";

export const UserProfileRTK = () => {
    const user = useAppSelector(selectCurrentUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const { logout, isLogoutLoading } = useAuth();

    if (!isAuthenticated || !user) {
        return (
            <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600">Non connecté</p>
            </div>
        );
    }

    const handleLogout = async () => {
        const result = await logout();

        if (!result.success) {
            <Error
                title="Erreur"
                description="Erreur lors de la déconnexion"
                icon={<Terminal />}
            />;
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
                        <span className="text-white font-medium text-lg">
                            {user.firstName[0]}
                            {user.lastName[0]}
                        </span>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                        @{user.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                        {user.email}
                    </p>
                </div>

                <div className="flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        disabled={isLogoutLoading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                            isLogoutLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        }`}
                    >
                        {isLogoutLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Déconnexion...
                            </>
                        ) : (
                            "Se déconnecter"
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <div className="h-5 w-5 text-green-400">✅</div>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                            Authentifié via cookies httpOnly
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                            <p>🔒 Token stocké dans un cookie sécurisé</p>
                            <p>🚫 Aucune donnée sensible dans localStorage</p>
                            <p>⚡ État synchronisé avec RTK Query</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
