import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    CardContent,
    CardDescription,
    CardFooter,
    CardTitle,
    Card as ShadCard,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Furniture } from "@/store/api/types";

export const Card = ({
    furniture,
    handleOpenDialog,
    handleOpenAlert,
}: {
    furniture: Furniture;
    handleOpenDialog: (furniture: Furniture) => void;
    handleOpenAlert: (furniture: Furniture) => void;
}) => {
    const navigate = useNavigate();

    return (
        <ShadCard className="flex flex-col gap-4 hover:shadow-lg transition-shadow duration-200 ease-in-out">
            <CardContent>
                <div className="flex flex-row justify-between gap-2 items-center">
                    <CardTitle>{furniture.name}</CardTitle>
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                navigate(`/furnitures/${furniture._id}`)
                            }
                            title="Voir les détails"
                            className="cursor-pointer"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="cursor-pointer"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => handleOpenDialog(furniture)}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer text-red-600"
                                    onClick={() => handleOpenAlert(furniture)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <CardDescription>
                    {furniture.description || "Aucune description"}
                </CardDescription>
            </CardContent>
            <CardFooter>
                <Badge variant="outline">{furniture.status}</Badge>
            </CardFooter>
        </ShadCard>
    );
};
