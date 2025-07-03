import { Navigate } from "react-router-dom";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { useAuth } from "@/hooks/useAuthRTK";
import { useAuthForm } from "@/hooks/useValidation";

import { registerSchema } from "@/schemas";

import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/slices/authSlice";

export const Register = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const { register, isRegisterLoading } = useAuth();

    const {
        data,
        errors,
        serverError,
        updateField,
        handleAuthSubmit,
        clearServerError,
    } = useAuthForm(registerSchema);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await handleAuthSubmit(async (formData) => {
            const result = await register(formData);
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
            <div className="w-full max-w-lg">
                <Card className="w-full">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">
                            Créer votre compte
                        </CardTitle>
                        <CardDescription className="text-center">
                            Pour créer votre compte, veuillez remplir les
                            informations ci-dessous.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {serverError && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        {serverError}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Informations personnelles */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Prénom */}
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="Votre prénom"
                                        value={data.firstName || ""}
                                        onChange={handleChange}
                                        className={
                                            errors.firstName
                                                ? "border-destructive"
                                                : ""
                                        }
                                        required
                                    />
                                    {errors.firstName && (
                                        <p className="text-sm text-destructive">
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>

                                {/* Nom */}
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Votre nom"
                                        value={data.lastName || ""}
                                        onChange={handleChange}
                                        className={
                                            errors.lastName
                                                ? "border-destructive"
                                                : ""
                                        }
                                        required
                                    />
                                    {errors.lastName && (
                                        <p className="text-sm text-destructive">
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Nom d'utilisateur */}
                            <div className="space-y-2">
                                <Label htmlFor="username">
                                    Nom d'utilisateur
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Nom d'utilisateur unique"
                                    value={data.username || ""}
                                    onChange={handleChange}
                                    className={
                                        errors.username
                                            ? "border-destructive"
                                            : ""
                                    }
                                    required
                                />
                                {errors.username && (
                                    <p className="text-sm text-destructive">
                                        {errors.username}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    3-20 caractères, lettres, chiffres, tirets
                                    et underscores uniquement
                                </p>
                            </div>

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
                                    placeholder="Mot de passe sécurisé"
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
                                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        8+ caractères
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        1 majuscule
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        1 minuscule
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        1 chiffre
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            {/* Bouton d'inscription */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isRegisterLoading || !!serverError}
                            >
                                {isRegisterLoading ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Création en cours...
                                    </>
                                ) : (
                                    "Créer mon compte"
                                )}
                            </Button>

                            {/* Lien vers login */}
                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">
                                    Vous avez déjà un compte ?{" "}
                                </span>
                                <a
                                    href="/login"
                                    className="text-primary underline-offset-4 hover:underline"
                                >
                                    Se connecter
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Conditions d'utilisation */}
                <Card className="mt-4">
                    <CardContent className="pt-6">
                        <p className="text-xs text-muted-foreground text-center">
                            En créant un compte, vous acceptez nos{" "}
                            <a
                                href="#"
                                className="text-primary underline-offset-4 hover:underline"
                            >
                                Conditions d'utilisation
                            </a>{" "}
                            et{" "}
                            <a
                                href="#"
                                className="text-primary underline-offset-4 hover:underline"
                            >
                                Politique de confidentialité
                            </a>
                            .
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
