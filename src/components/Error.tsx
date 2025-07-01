import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

type ErrorProps = {
    title: string;
    description: string;
    icon?: React.ReactNode;
    methods?: () => void;
};

export const Error = ({ title, description, icon, methods }: ErrorProps) => {
    return (
        <Alert variant="destructive">
            {icon ? icon : <Terminal />}
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
            {methods && (
                <Button variant="outline" onClick={methods}>
                    Réessayer
                </Button>
            )}
        </Alert>
    );
};
