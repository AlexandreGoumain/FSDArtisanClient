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
import { SupplierModal } from "./supplier-modal";
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
interface Supplier {
    id: string;
    name: string;
    contact: {
        email: string;
        phone: string;
    };
    category: {
        name: string;
        color: string;
    };
    status: "Actif" | "En attente";
    lastOrder: string;
    iconColor: string;
}

// Données d'exemple
const suppliers: Supplier[] = [
    {
        id: "FRN-001",
        name: "Mobilier Pro France",
        contact: {
            email: "contact@mobilierpro.fr",
            phone: "+33 1 23 45 67 89",
        },
        category: {
            name: "Bois",
            color: "bg-blue-100 text-blue-800",
        },
        status: "Actif",
        lastOrder: "2024-11-15T10:30:00",
        iconColor: "bg-blue-500",
    },
    {
        id: "FRN-002",
        name: "Déco Salon Expert",
        contact: {
            email: "info@decosalon.fr",
            phone: "+33 2 34 56 78 90",
        },
        category: {
            name: "Fer",
            color: "bg-green-100 text-green-800",
        },
        status: "Actif",
        lastOrder: "2024-11-12T10:30:00",
        iconColor: "bg-green-500",
    },
    {
        id: "FRN-003",
        name: "Chambre Design Plus",
        contact: {
            email: "contact@chambredesign.fr",
            phone: "+33 3 45 67 89 01",
        },
        category: {
            name: "Plastique",
            color: "bg-purple-100 text-purple-800",
        },
        status: "En attente",
        lastOrder: "2024-11-08T10:30:00",
        iconColor: "bg-purple-500",
    },
];

export function SuppliersTable() {
    //TODO : work on modal modifier, add a button to open it
    //TODO : work on modal ajouter, add a button to open it
    //TODO : work on modal supprimer, add a button to open it and add a confirmation
    const [openDialog, setOpenDialog] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const handleOpenDialog = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsCreating(false);
        setOpenDialog(true);
    };

    const handleOpenCreateDialog = () => {
        setSelectedSupplier(null);
        setIsCreating(true);
        setOpenDialog(true);
    };

    const handleOpenAlert = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setOpenAlert(true);
    };

    const handleDeleteSupplier = () => {
        console.log("Suppression du fournisseur:", selectedSupplier?.name);
        setOpenAlert(false);
        setSelectedSupplier(null);
    };

    const handleSaveSupplier = (supplierData: Partial<Supplier>) => {
        if (isCreating) {
            const newSupplier = {
                id: `FRN-00${suppliers.length + 1}`,
                ...supplierData,
            };
            console.log("Nouveau fournisseur créé:", newSupplier);
            // Ici vous pouvez ajouter la logique de création (API call, etc.)
        } else {
            const updatedSupplier = {
                ...selectedSupplier!,
                ...supplierData,
            };
            console.log("Fournisseur mis à jour:", updatedSupplier);
            // Ici vous pouvez ajouter la logique de modification (API call, etc.)
        }

        setOpenDialog(false);
        setSelectedSupplier(null);
        setIsCreating(false);
    };

    // Filtrer les fournisseurs
    const filteredSuppliers = suppliers.filter((supplier) => {
        const matchesSearch =
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.contact.email
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesCategory =
            categoryFilter === "all" ||
            supplier.category.name === categoryFilter;
        const matchesStatus =
            statusFilter === "all" || supplier.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <>
            <div className="space-y-4 px-4 lg:px-6">
                <div className="flex flex-row justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Tous les fournisseurs
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
                            placeholder="Rechercher un fournisseur"
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
                        </SelectContent>
                    </Select>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Tous les statuts
                            </SelectItem>
                            <SelectItem value="Actif">Actif</SelectItem>
                            <SelectItem value="En attente">
                                En attente
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fournisseur</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Dernière commande</TableHead>
                                <TableHead className="text-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSuppliers.map((supplier) => (
                                <TableRow key={supplier.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 rounded ${supplier.iconColor} flex items-center justify-center`}
                                            >
                                                <div className="w-4 h-4 bg-white rounded-sm"></div>
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {supplier.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    ID: {supplier.id}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="text-sm">
                                                {supplier.contact.email}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {supplier.contact.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={supplier.category.color}
                                        >
                                            {supplier.category.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                supplier.status === "Actif"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className={
                                                supplier.status === "Actif"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }
                                        >
                                            {supplier.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(
                                            supplier.lastOrder
                                        ).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                        {" - "}
                                        {new Date(
                                            supplier.lastOrder
                                        ).toLocaleTimeString("fr-FR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
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
                                                                supplier
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
                                                                supplier
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

            {/* Modale pour créer/modifier un fournisseur */}
            <SupplierModal
                open={openDialog}
                onOpenChange={setOpenDialog}
                isCreating={isCreating}
                selectedSupplier={selectedSupplier}
                onSave={handleSaveSupplier}
            />

            {/* AlertDialog pour supprimer */}
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Êtes-vous sûr de vouloir supprimer ce fournisseur ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Elle supprimera
                            définitivement
                            <strong> {selectedSupplier?.name} </strong> de la
                            base de données.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteSupplier}
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
