import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div
                    className={cn("flex flex-col gap-6", className)}
                    {...props}
                >
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            <form className="p-6 md:p-8">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-2xl font-bold">
                                            Créer votre compte
                                        </h1>
                                        <p className="text-muted-foreground text-balance">
                                            Rejoignez-nous aujourd&apos;hui
                                        </p>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="firstname">
                                            Prénom
                                        </Label>
                                        <Input
                                            id="firstname"
                                            type="text"
                                            placeholder="John"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="lastname">Nom</Label>
                                        <Input
                                            id="lastname"
                                            type="text"
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="password">
                                            Mot de passe
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="confirmPassword">
                                            Confirmer le mot de passe
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Créer un compte
                                    </Button>

                                    <div className="text-center text-sm">
                                        Vous avez déjà un compte ?{" "}
                                        <a
                                            href="/login"
                                            className="underline underline-offset-4"
                                        >
                                            Connexion
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
                        En créant un compte, vous acceptez nos{" "}
                        <a href="#">Conditions d&apos;utilisation</a> et{" "}
                        <a href="#">Politique de confidentialité</a>.
                    </div>
                </div>
            </div>
        </div>
    );
}
