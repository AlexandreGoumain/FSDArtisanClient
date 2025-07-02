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

// API imports
import {
    useCreateSupplierMutation,
    useDeleteSupplierMutation,
    useGetAllSuppliersQuery,
    useUpdateSupplierMutation,
} from "@/store/api/suppliersApi";
import type { Supplier, SupplierCreate } from "@/store/api/types/suppliersType";

import { useGetAllRessourcesCategoriesQuery } from "@/store/api/ressourcesCategoriesApi";

// Définition des catégories

export function SuppliersTable() {
    // État local
    const [openDialog, setOpenDialog] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Récupération des données
    const {
        data: suppliers,
        isLoading: isSuppliersLoading,
        isError: isSuppliersError,
        refetch: refetchSuppliers,
    } = useGetAllSuppliersQuery();

    // Mutations
    const [createSupplier, { isLoading: isCreating_api }] =
        useCreateSupplierMutation();
    const [updateSupplier, { isLoading: isUpdating }] =
        useUpdateSupplierMutation();
    const [deleteSupplier, { isLoading: isDeleting }] =
        useDeleteSupplierMutation();

    const {
        data: resourceCategories,
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
    } = useGetAllRessourcesCategoriesQuery();

    // Handlers pour les modales
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

    // Opération de suppression
    const handleDeleteSupplier = async () => {
        if (!selectedSupplier) return;

        try {
            await deleteSupplier(selectedSupplier._id).unwrap();
            console.log(
                "Fournisseur supprimé avec succès:",
                selectedSupplier.name
            );
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        } finally {
            setOpenAlert(false);
            setSelectedSupplier(null);
        }
    };

    // Opération de sauvegarde (création/mise à jour)
    const handleSaveSupplier = async (supplierData: Partial<Supplier>) => {
        try {
            if (isCreating) {
                // Créer un nouveau fournisseur
                const newSupplierData: SupplierCreate = {
                    name: supplierData.name || "",
                    email: supplierData.email || "",
                    phone: supplierData.phone || "",
                };

                await createSupplier(newSupplierData).unwrap();
                console.log("Nouveau fournisseur créé avec succès");
            } else {
                // Mettre à jour un fournisseur existant
                if (!selectedSupplier) return;

                const updatedSupplierData = {
                    _id: selectedSupplier._id,
                    name: supplierData.name || selectedSupplier.name,
                    email: supplierData.email || selectedSupplier.email,
                    phone: supplierData.phone || selectedSupplier.phone,
                };

                await updateSupplier(updatedSupplierData).unwrap();
                console.log("Fournisseur mis à jour avec succès");
            }
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
        } finally {
            setOpenDialog(false);
            setSelectedSupplier(null);
            setIsCreating(false);
        }
    };

    // Fonction pour obtenir le nom d'une catégorie par son ID
    const getCategoryName = (categoryId: string) => {
        const category = resourceCategories?.find(
            (cat) => cat._id === categoryId
        );
        return category?.label || "Inconnue";
    };

    // États de chargement et d'erreur
    if (isSuppliersLoading || isCategoriesLoading) {
        return <div>Chargement des fournisseurs...</div>;
    }

    if (isSuppliersError || isCategoriesError) {
        return (
            <Error
                title="Erreur lors de la récupération des données"
                description="Veuillez réessayer plus tard"
                methods={refetchSuppliers}
            />
        );
    }

    // Filtrer les fournisseurs
    const filteredSuppliers = (suppliers || []).filter((supplier) => {
        const matchesSearch =
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            categoryFilter === "all" ||
            supplier.ressourceCategories.includes(categoryFilter);

        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <div className="space-y-4 px-4 lg:px-6">
                <div className="flex flex-row justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Tous les fournisseurs
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
                            {resourceCategories?.map((category) => (
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
                                <TableHead>Fournisseur</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Catégories de ressources</TableHead>
                                <TableHead className="text-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSuppliers.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        Aucun fournisseur trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredSuppliers.map((supplier) => (
                                    <TableRow key={supplier._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
                                                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {supplier.name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        ID:{" "}
                                                        {supplier._id.slice(-8)}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-sm">
                                                    {supplier.email}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {supplier.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {supplier.ressourceCategories
                                                    .length === 0 ? (
                                                    <span className="text-sm text-muted-foreground">
                                                        Aucune catégorie
                                                    </span>
                                                ) : (
                                                    supplier.ressourceCategories.map(
                                                        (categoryId) => (
                                                            <Badge
                                                                key={categoryId}
                                                                className="text-xs"
                                                            >
                                                                {getCategoryName(
                                                                    categoryId
                                                                )}
                                                            </Badge>
                                                        )
                                                    )
                                                )}
                                            </div>
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
                                                                    supplier
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
                                                                    supplier
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
                                ))
                            )}
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
