import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type ErrorProps = {
    title: string;
    description: string;
    icon?: React.ReactNode;
};

export const Error = ({ title, description, icon }: ErrorProps) => {
    return (
        <Alert variant="destructive">
            {icon ? icon : <Terminal />}
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
};
