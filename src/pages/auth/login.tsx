import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthActions } from "@/context/auth";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuthActions();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // TODO: Remplacez cette simulation par votre vrai appel API
            const response = await simulateLogin(email, password);

            if (response.success && response.token && response.user) {
                // Utiliser le hook d'authentification pour connecter l'utilisateur
                login({
                    token: response.token,
                    user: response.user,
                });

                // Rediriger vers la page d'accueil ou dashboard
                navigate("/");
            } else {
                setError(response.message || "Erreur de connexion");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la connexion");
            console.error("Erreur de connexion:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div
                    className={cn("flex flex-col gap-6", className)}
                    {...props}
                >
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            <form
                                onSubmit={handleSubmit}
                                className="p-6 md:p-8"
                            >
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-2xl font-bold">
                                            Connexion
                                        </h1>
                                        <p className="text-muted-foreground text-balance">
                                            Connectez-vous à votre compte pour
                                            accéder à votre espace.
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">
                                                Mot de passe
                                            </Label>
                                            <a
                                                href="#"
                                                className="ml-auto text-sm underline-offset-2 hover:underline"
                                            >
                                                Mot de passe oublié ?
                                            </a>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            placeholder="********"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isLoading}
                                    >
                                        {isLoading
                                            ? "Connexion..."
                                            : "Connexion"}
                                    </Button>

                                    <div className="text-center text-sm">
                                        Vous n&apos;avez pas de compte ?{" "}
                                        <a
                                            href="/register"
                                            className="underline underline-offset-4"
                                        >
                                            Créer un compte
                                        </a>
                                    </div>
                                </div>
                            </form>
                            <div className="bg-muted relative hidden md:block">
                                <img
                                    src="/placeholder.svg"
                                    alt="Image"
                                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        En vous connectant, vous acceptez nos{" "}
                        <a href="#">Conditions d&apos;utilisation</a> et{" "}
                        <a href="#">Politique de confidentialité</a>.
                    </div>
                </div>
            </div>
        </div>
    );
}

// Fonction de simulation - À remplacer par votre vraie API
async function simulateLogin(
    email: string,
    password: string
): Promise<{
    success: boolean;
    token?: string;
    user?: {
        email: string;
        username: string;
        firstName: string;
        lastName: string;
    };
    message?: string;
}> {
    // Simulation d'un délai d'API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulation de validation
    if (email === "admin@example.com" && password === "password") {
        return {
            success: true,
            token: "fake-jwt-token-" + Date.now(),
            user: {
                email: email,
                username: "admin",
                firstName: "Admin",
                lastName: "User",
            },
        };
    } else {
        return {
            success: false,
            message: "Email ou mot de passe incorrect",
        };
    }
}
