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

import { Error } from "@/components/Error";
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

// API imports
import {
    useCreateRessourceMutation,
    useDeleteRessourceMutation,
    useGetAllRessourcesQuery,
    useUpdateRessourceMutation,
} from "@/store/api/ressourcesApi";
import { useGetAllRessourcesCategoriesQuery } from "@/store/api/ressourcesCategoriesApi";
import { useGetAllSuppliersQuery } from "@/store/api/suppliersApi";
import type {
    Ressource,
    RessourceCreate,
} from "@/store/api/types/ressourcesType";

export function RessourcesTable() {
    // État local
    const [openDialog, setOpenDialog] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedRessource, setSelectedRessource] =
        useState<Ressource | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Récupération des données
    const {
        data: ressources,
        isLoading: isRessourcesLoading,
        isError: isRessourcesError,
        refetch: refetchRessources,
    } = useGetAllRessourcesQuery();

    const {
        data: categories,
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
    } = useGetAllRessourcesCategoriesQuery();

    const {
        data: suppliers,
        isLoading: isSuppliersLoading,
        isError: isSuppliersError,
    } = useGetAllSuppliersQuery();

    // Mutations
    const [createRessource, { isLoading: isCreating_api }] =
        useCreateRessourceMutation();
    const [updateRessource, { isLoading: isUpdating }] =
        useUpdateRessourceMutation();
    const [deleteRessource, { isLoading: isDeleting }] =
        useDeleteRessourceMutation();

    // Handlers pour les modales
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

    // Opération de suppression
    const handleDeleteRessource = async () => {
        if (!selectedRessource) return;

        try {
            await deleteRessource(selectedRessource._id).unwrap();
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        } finally {
            setOpenAlert(false);
            setSelectedRessource(null);
        }
    };

    // Opération de sauvegarde (création/mise à jour)
    const handleSaveRessource = async (ressourceData: Partial<Ressource>) => {
        try {
            if (isCreating) {
                // Créer une nouvelle ressource
                const newRessourceData: RessourceCreate = {
                    name: ressourceData.name || "",
                    idCategory: ressourceData.idCategory || "",
                    idSupplier: ressourceData.idSupplier || "",
                    description: ressourceData.description || "",
                };

                await createRessource(newRessourceData).unwrap();
            } else {
                // Mettre à jour une ressource existante
                if (!selectedRessource) return;

                const updatedRessourceData = {
                    _id: selectedRessource._id,
                    name: ressourceData.name || selectedRessource.name,
                    idCategory:
                        ressourceData.idCategory ||
                        selectedRessource.idCategory,
                    idSupplier:
                        ressourceData.idSupplier ||
                        selectedRessource.idSupplier,
                    description: ressourceData.description || "",
                };

                await updateRessource(updatedRessourceData).unwrap();
            }
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
        } finally {
            setOpenDialog(false);
            setSelectedRessource(null);
            setIsCreating(false);
        }
    };

    // Fonction pour obtenir le nom de la catégorie
    const getCategoryName = (idCategory: string) => {
        const category = categories?.find((cat) => cat._id === idCategory);
        return category?.label || "Catégorie inconnue";
    };

    // Fonction pour obtenir le nom du fournisseur
    const getSupplierName = (idSupplier: string) => {
        const supplier = suppliers?.find((sup) => sup._id === idSupplier);
        return supplier?.name || "Fournisseur inconnu";
    };

    // Fonction pour obtenir la couleur de la catégorie (basée sur le nom)
    const getCategoryColor = (categoryName: string) => {
        const colorMap: { [key: string]: string } = {
            Bois: "bg-blue-100 text-blue-800",
            Fer: "bg-green-100 text-green-800",
            Plastique: "bg-purple-100 text-purple-800",
        };
        return colorMap[categoryName] || "bg-gray-100 text-gray-800";
    };

    // États de chargement et d'erreur
    if (isRessourcesLoading || isCategoriesLoading || isSuppliersLoading) {
        return <div>Chargement des ressources...</div>;
    }

    if (isRessourcesError || isCategoriesError || isSuppliersError) {
        return (
            <Error
                title="Erreur lors de la récupération des données"
                description="Veuillez réessayer plus tard"
                methods={refetchRessources}
            />
        );
    }

    // Filtrer les ressources
    const filteredRessources = (ressources || []).filter((ressource) => {
        const matchesSearch = ressource.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory =
            categoryFilter === "all" || ressource.idCategory === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <div className="space-y-4 px-4 lg:px-6">
                <div className="flex flex-row justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Toutes les ressources
                    </h2>
                    <Button
                        onClick={handleOpenCreateDialog}
                        disabled={isCreating_api}
                    >
                        {isCreating_api ? "Création..." : "Ajouter"}
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
                        disabled={isCategoriesError}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Toutes les catégories
                            </SelectItem>
                            {!isCategoriesError &&
                                categories?.map((category) => (
                                    <SelectItem
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.label}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead>Fournisseur</TableHead>
                                <TableHead className="text-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRessources.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        Aucune ressource trouvée
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRessources.map((ressource) => {
                                    const categoryName = getCategoryName(
                                        ressource.idCategory
                                    );
                                    const supplierName = getSupplierName(
                                        ressource.idSupplier
                                    );

                                    return (
                                        <TableRow key={ressource._id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
                                                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {ressource.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            ID:{" "}
                                                            {ressource._id.slice(
                                                                -8
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={getCategoryColor(
                                                        categoryName
                                                    )}
                                                >
                                                    {categoryName}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">
                                                    {supplierName}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={
                                                                    isUpdating ||
                                                                    isDeleting
                                                                }
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
                                                                disabled={
                                                                    isUpdating
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
                                                                disabled={
                                                                    isDeleting
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
                                    );
                                })
                            )}
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
                            disabled={isDeleting}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {isDeleting ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
