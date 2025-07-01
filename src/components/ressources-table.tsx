import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { RessourceModal } from "./ressource-modal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

// Types pour les données
interface Ressource {
    id: string;
    name: string;
    category: {
        name: string;
        color: string;
    };
    quantity: number;
    unit: string;
    iconColor: string;
}

// Données d'exemple
const ressources: Ressource[] = [
    {
        id: "RES-001",
        name: "Planches de chêne",
        category: {
            name: "Bois",
            color: "bg-blue-100 text-blue-800",
        },
        quantity: 150,
        unit: "m²",
        iconColor: "bg-blue-500",
    },
    {
        id: "RES-002",
        name: "Tubes d'acier",
        category: {
            name: "Fer",
            color: "bg-green-100 text-green-800",
        },
        quantity: 75,
        unit: "unité",
        iconColor: "bg-green-500",
    },
    {
        id: "RES-003",
        name: "Plaques PVC",
        category: {
            name: "Plastique",
            color: "bg-purple-100 text-purple-800",
        },
        quantity: 200,
        unit: "m²",
        iconColor: "bg-purple-500",
    },
    {
        id: "RES-004",
        name: "Vis en acier",
        category: {
            name: "Quincaillerie",
            color: "bg-orange-100 text-orange-800",
        },
        quantity: 500,
        unit: "unité",
        iconColor: "bg-orange-500",
    },
];

export function RessourcesTable() {
    //TODO : work on modal modifier, add a button to open it
    //TODO : work on modal ajouter, add a button to open it
    //TODO : work on modal supprimer, add a button to open it and add a confirmation
    const [openDialog, setOpenDialog] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedRessource, setSelectedRessource] =
        useState<Ressource | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const handleOpenDialog = (ressource: Ressource) => {
        setSelectedRessource(ressource);
        setIsCreating(false);
        setOpenDialog(true);
    };

    const handleOpenCreateDialog = () => {
        setSelectedRessource(null);
        setIsCreating(true);
        setOpenDialog(true);
    };

    const handleOpenAlert = (ressource: Ressource) => {
        setSelectedRessource(ressource);
        setOpenAlert(true);
    };

    const handleDeleteRessource = () => {
        console.log("Suppression de la ressource:", selectedRessource?.name);
        setOpenAlert(false);
        setSelectedRessource(null);
    };

    const handleSaveRessource = (ressourceData: Partial<Ressource>) => {
        if (isCreating) {
            const newRessource = {
                id: `RES-00${ressources.length + 1}`,
                ...ressourceData,
            };
            console.log("Nouvelle ressource créée:", newRessource);
            // Ici vous pouvez ajouter la logique de création (API call, etc.)
        } else {
            const updatedRessource = {
                ...selectedRessource!,
                ...ressourceData,
            };
            console.log("Ressource mise à jour:", updatedRessource);
            // Ici vous pouvez ajouter la logique de modification (API call, etc.)
        }

        setOpenDialog(false);
        setSelectedRessource(null);
        setIsCreating(false);
    };

    // Filtrer les ressources
    const filteredRessources = ressources.filter((ressource) => {
        const matchesSearch = ressource.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory =
            categoryFilter === "all" ||
            ressource.category.name === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <div className="space-y-4 px-4 lg:px-6">
                <div className="flex flex-row justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Toutes les ressources
                    </h2>
                    <Button onClick={handleOpenCreateDialog}>
                        Ajouter
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Filtres */}
                <div className="flex flex-row gap-2 w-3/4">
                    <div className="flex flex-row gap-2 items-center w-1/3">
                        <Search className="w-4 h-4" />
                        <Input
                            placeholder="Rechercher une ressource"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Toutes les catégories
                            </SelectItem>
                            <SelectItem value="Bois">Bois</SelectItem>
                            <SelectItem value="Fer">Fer</SelectItem>
                            <SelectItem value="Plastique">Plastique</SelectItem>
                            <SelectItem value="Quincaillerie">
                                Quincaillerie
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead>Quantité</TableHead>
                                <TableHead>Unité</TableHead>
                                <TableHead className="text-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRessources.map((ressource) => (
                                <TableRow key={ressource.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 rounded ${ressource.iconColor} flex items-center justify-center`}
                                            >
                                                <div className="w-4 h-4 bg-white rounded-sm"></div>
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {ressource.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    ID: {ressource.id}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={ressource.category.color}
                                        >
                                            {ressource.category.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-lg">
                                            {ressource.quantity}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-lg">
                                            {ressource.unit}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            handleOpenDialog(
                                                                ressource
                                                            )
                                                        }
                                                    >
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer text-red-600"
                                                        onClick={() =>
                                                            handleOpenAlert(
                                                                ressource
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Supprimer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modale pour créer/modifier une ressource */}
            <RessourceModal
                open={openDialog}
                onOpenChange={setOpenDialog}
                isCreating={isCreating}
                selectedRessource={selectedRessource}
                onSave={handleSaveRessource}
            />

            {/* AlertDialog pour supprimer */}
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Êtes-vous sûr de vouloir supprimer cette ressource ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Elle supprimera
                            définitivement
                            <strong> {selectedRessource?.name} </strong> de la
                            base de données.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteRessource}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
