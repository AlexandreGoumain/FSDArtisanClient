import { Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

import { Error } from "@/components/Error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FURNITURE_STATUS_OPTIONS } from "@/lib/utils";
import { Card } from "./components/Card";
import { FurnitureModal } from "./components/FurnitureModal";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    useCreateFurnitureMutation,
    useDeleteFurnitureMutation,
    useGetAllFurnitureCategoriesQuery,
    useGetAllFurnituresQuery,
    useUpdateFurnitureMutation,
} from "@/store/api";

import type {
    Furniture,
    FurnitureCreate,
    FurnitureUpdate,
} from "@/store/api/types";

export const Furnitures = () => {
    //TODO: rework des staus (création / modification ) - (cohérence avec le back)

    const {
        data: furnitures,
        isLoading,
        isError,
        refetch: refetchFurnitures,
    } = useGetAllFurnituresQuery();

    // Récupération des catégories de meubles
    const {
        data: categories,
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
    } = useGetAllFurnitureCategoriesQuery();

    // Mutation pour créer un nouveau meuble
    const [createFurniture, { isLoading: isCreating }] =
        useCreateFurnitureMutation();

    // Mutation pour mettre à jour un meuble
    const [updateFurniture, { isLoading: isUpdating }] =
        useUpdateFurnitureMutation();

    // Mutation pour supprimer un meuble
    const [deleteFurniture, { isLoading: isDeleting }] =
        useDeleteFurnitureMutation();

    const [selectedFurniture, setSelectedFurniture] =
        useState<Furniture | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [isCreatingMode, setIsCreatingMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const handleOpenDialog = (furniture: Furniture) => {
        setSelectedFurniture(furniture);
        setIsCreatingMode(false);
        setOpenDialog(true);
    };

    const handleOpenCreateDialog = () => {
        setSelectedFurniture(null);
        setIsCreatingMode(true);
        setOpenDialog(true);
    };

    const handleOpenAlert = (furniture: Furniture) => {
        setSelectedFurniture(furniture);
        setOpenAlert(true);
    };

    const handleDeleteFurniture = async () => {
        if (!selectedFurniture) return;

        try {
            await deleteFurniture(selectedFurniture._id).unwrap();
            setOpenAlert(false);
            setSelectedFurniture(null);
        } catch {
            <Error
                title="Erreur lors de la suppression"
                description="Veuillez réessayer plus tard"
                methods={refetchFurnitures}
            />;
        }
    };

    const handleSaveFurniture = async (furnitureData: FurnitureCreate) => {
        try {
            if (isCreatingMode) {
                // Créer un nouveau meuble
                await createFurniture(furnitureData).unwrap();
            } else {
                // Mettre à jour un meuble existant
                if (!selectedFurniture) return;

                const updateData: FurnitureUpdate = {
                    ...furnitureData,
                    _id: selectedFurniture._id,
                };

                await updateFurniture(updateData).unwrap();
            }

            setOpenDialog(false);
            setSelectedFurniture(null);
            setIsCreatingMode(false);
        } catch {
            <Error
                title="Erreur lors de la sauvegarde"
                description="Veuillez réessayer plus tard"
                methods={refetchFurnitures}
            />;
        }
    };

    if (isLoading) return <div>Loading...</div>;

    if (isError)
        return (
            <Error
                title="Erreur lors de la récupération des meubles"
                description="Veuillez réessayer plus tard"
                methods={refetchFurnitures}
            />
        );

    // Filtrer les meubles
    const filteredFurnitures = (
        furnitures && furnitures.length > 0 ? furnitures : []
    ).filter((furniture: Furniture) => {
        const matchesSearch = furniture.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        // Filtrage par catégorie basé sur l'idCategory
        const matchesCategory =
            categoryFilter === "all" || furniture.idCategory === categoryFilter;

        const matchesStatus =
            statusFilter === "all" || furniture.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <div className="space-y-4 px-4 lg:px-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center">
                    <h2 className="text-xl font-semibold">Tous les meubles</h2>
                    <Button
                        onClick={handleOpenCreateDialog}
                        disabled={isCreating || isUpdating || isDeleting}
                    >
                        {isCreating || isUpdating || isDeleting
                            ? "En cours..."
                            : "Ajouter"}
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex flex-row gap-2 w-3/4">
                    <div className="flex flex-row gap-2 items-center w-1/3">
                        <Search className="w-4 h-4" />
                        <Input
                            placeholder="Rechercher un meuble"
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
                            {!isCategoriesLoading &&
                                !isCategoriesError &&
                                categories?.map((category, index) => (
                                    <SelectItem
                                        key={index}
                                        value={category._id}
                                    >
                                        {category.label}
                                    </SelectItem>
                                ))}
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
                            {FURNITURE_STATUS_OPTIONS.map((statusOption) => (
                                <SelectItem
                                    key={statusOption.value}
                                    value={statusOption.value}
                                >
                                    {statusOption.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredFurnitures.map((furniture) => (
                    <Card
                        key={furniture._id}
                        furniture={furniture}
                        handleOpenDialog={handleOpenDialog}
                        handleOpenAlert={handleOpenAlert}
                    />
                ))}
            </div>

            {/* Modale pour créer/modifier un meuble */}
            <FurnitureModal
                open={openDialog}
                onOpenChange={setOpenDialog}
                isCreating={isCreatingMode}
                selectedFurniture={selectedFurniture}
                onSave={handleSaveFurniture}
            />

            {/* AlertDialog pour supprimer */}
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Êtes-vous sûr de vouloir supprimer ce meuble ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Elle supprimera
                            définitivement
                            <strong> {selectedFurniture?.name} </strong> de la
                            base de données.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteFurniture}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {isDeleting ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
