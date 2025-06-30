import { Navigate } from "react-router-dom";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../hooks/useAuthRTK";
import { useAuthForm } from "../../hooks/useValidation";
import { loginSchema } from "../../schemas/auth";
import { useAppSelector } from "../../store/hooks";
import { selectIsAuthenticated } from "../../store/slices/authSlice";

export const Login = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const { login, isLoginLoading } = useAuth();

    const {
        data,
        errors,
        serverError,
        updateField,
        handleAuthSubmit,
        clearServerError,
    } = useAuthForm(loginSchema);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await handleAuthSubmit(async (formData) => {
            const result = await login(formData);
            return result;
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateField(name as keyof typeof data, value);

        if (serverError) {
            clearServerError();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md">
                <Card className="w-full">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">
                            Connexion
                        </CardTitle>
                        <CardDescription className="text-center">
                            Pour accéder à votre espace, veuillez vous
                            connecter.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Erreur serveur */}
                            {serverError && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        {serverError}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Adresse email"
                                    value={data.email || ""}
                                    onChange={handleChange}
                                    className={
                                        errors.email ? "border-destructive" : ""
                                    }
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Mot de passe */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={data.password || ""}
                                    onChange={handleChange}
                                    className={
                                        errors.password
                                            ? "border-destructive"
                                            : ""
                                    }
                                    required
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Bouton de connexion */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoginLoading || !!serverError}
                            >
                                {isLoginLoading ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Connexion...
                                    </>
                                ) : (
                                    "Se connecter"
                                )}
                            </Button>

                            {/* Lien vers register */}
                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">
                                    Pas encore de compte ?{" "}
                                </span>
                                <a
                                    href="/register"
                                    className="text-primary underline-offset-4 hover:underline"
                                >
                                    S'inscrire
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Données de test */}
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            🧪 Données de test
                            <Badge variant="secondary">Demo</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1 text-sm font-mono">
                            <div>
                                <strong>Email:</strong> admin@example.com
                            </div>
                            <div>
                                <strong>Password:</strong> password
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
