import { TreePine } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Error } from "@/components/Error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    getFurnitureStatusBadgeClassName,
    getFurnitureStatusBadgeVariant,
    translateFurnitureStatus,
    type FurnitureStatusValue,
} from "@/lib/utils";

import {
    useGetAllRessourcesCategoriesQuery,
    useGetFurnitureByIdQuery,
    useGetRessourceByIdQuery,
} from "@/store/api";

import type { Supplier } from "@/store/api/types";

export const ResourceItem = ({
    idRessource,
    quantity,
    Supplier,
}: {
    idRessource?: string;
    quantity?: number;
    Supplier?: Supplier;
}) => {
    const { data: resource, isLoading } = useGetRessourceByIdQuery(
        idRessource || ""
    );
    const { data: categories } = useGetAllRessourcesCategoriesQuery();

    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-muted rounded"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-muted rounded w-16"></div>
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <TreePine className="w-5 h-5 mt-0.5 text-red-500" />
                <div className="flex-1">
                    <h4 className="font-medium text-red-700">
                        Ressource introuvable
                    </h4>
                    <p className="text-xs text-red-600 mt-1">
                        ID: {idRessource}
                    </p>
                </div>
                <span className="text-sm font-semibold text-red-600">
                    {quantity} unités
                </span>
            </div>
        );
    }

    const categoryName =
        categories?.find((cat) => cat._id === resource.idCategory)?.label ||
        "Catégorie inconnue";

    // Icônes basées sur le type de ressource
    const getResourceIcon = (categoryName: string) => {
        switch (categoryName.toLowerCase()) {
            case "bois":
                return "🌳";
            case "fer":
                return "🔧";
            case "plastique":
                return "🧪";
            default:
                return "📦";
        }
    };

    const icon = getResourceIcon(categoryName);

    return (
        <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            {idRessource && <div className="text-lg">{icon}</div>}
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                        {idRessource ? resource.name : Supplier?.name}
                    </h4>
                    {idRessource && quantity && (
                        <span className="text-sm font-semibold text-orange-600">
                            {quantity} {quantity > 1 ? "unités" : "unité"}
                        </span>
                    )}
                </div>
                {idRessource && (
                    <p className="text-xs text-gray-600 mt-1">
                        {resource.description}
                    </p>
                )}
                {Supplier && (
                    <p className="text-xs text-gray-600 mt-1">
                        {Supplier.name}
                    </p>
                )}
                <Button
                    className="mt-2"
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        idRessource
                            ? navigate(`/ressources/${resource._id}`)
                            : navigate(`/suppliers`)
                    }
                >
                    {idRessource ? "Voir la ressource" : "Voir le fournisseur"}
                </Button>
            </div>
        </div>
    );
};

export const DetailledFurniture = () => {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);

    const {
        data: furniture,
        isLoading,
        isError,
        refetch,
    } = useGetFurnitureByIdQuery(id || "", {
        skip: !id, // Skip si pas d'ID
    });

    if (isLoading) {
        return (
            <div className="space-y-4 px-4 lg:px-6">
                <div className="text-center py-8">
                    <p className="text-lg text-muted-foreground">
                        Chargement...
                    </p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <Error
                title="Erreur lors du chargement du meuble"
                description="Impossible de récupérer les détails du meuble"
                methods={refetch}
            />
        );
    }

    if (!furniture) {
        return (
            <div className="space-y-4 px-4 lg:px-6">
                <div className="text-center py-8">
                    <p className="text-lg text-muted-foreground">
                        Meuble non trouvé
                    </p>
                </div>
            </div>
        );
    }

    // Générer plusieurs images pour la galerie
    const images = Array.from(
        { length: 4 },
        (_, i) => `https://picsum.photos/400/300?random=${furniture._id + i}`
    );

    return (
        <div className="space-y-6 px-4 lg:px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section Images */}
                <div className="space-y-4">
                    {/* Image principale */}
                    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                        <img
                            src={images[selectedImage]}
                            alt={furniture.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Miniatures */}
                    <div className="grid grid-cols-4 gap-2">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`aspect-square overflow-hidden rounded-md border-2 ${
                                    selectedImage === index
                                        ? "border-primary"
                                        : "border-transparent hover:border-muted-foreground"
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={`Vue ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section Informations */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {furniture.name}
                        </h1>

                        <p className="text-muted-foreground leading-relaxed">
                            {furniture.description || "Description du meuble"}.
                        </p>
                    </div>

                    {/* Statut */}
                    <div>
                        <Badge
                            variant={getFurnitureStatusBadgeVariant(
                                furniture.status as FurnitureStatusValue
                            )}
                            className={getFurnitureStatusBadgeClassName(
                                furniture.status as FurnitureStatusValue
                            )}
                        >
                            {translateFurnitureStatus(
                                furniture.status as FurnitureStatusValue
                            )}{" "}
                            - {furniture.quantity} unités
                        </Badge>
                    </div>

                    {/* Ressources Nécessaires */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <TreePine className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-semibold">
                                Ressources Nécessaires
                            </h3>
                        </div>

                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {furniture.ressources &&
                            furniture.ressources.length > 0 ? (
                                furniture.ressources.map((resource) => (
                                    <ResourceItem
                                        key={resource._id}
                                        idRessource={resource.idRessource}
                                        quantity={resource.quantity}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                    <TreePine className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">
                                        Aucune ressource nécessaire
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
