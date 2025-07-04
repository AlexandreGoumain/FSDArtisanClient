import { useState } from "react";
import { useParams } from "react-router-dom";

import { Error } from "@/components/Error";
import { Badge } from "@/components/ui/badge";
import { ResourceItem } from "@/pages/furnitures";

import {
    useGetRessourceByIdQuery,
    useGetRessourceCategoryByIdQuery,
    useGetSupplierByIdQuery,
} from "@/store/api";

export const DetailledRessource = () => {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);

    const {
        data: ressource,
        isLoading: isLoadingRessource,
        isError: isErrorRessource,
        refetch: refetchRessource,
    } = useGetRessourceByIdQuery(id || "", {
        skip: !id, // Skip si pas d'ID
    });

    const {
        data: supplier,
        isLoading: isLoadingSupplier,
        isError: isErrorSupplier,
        refetch: refetchSupplier,
    } = useGetSupplierByIdQuery(ressource?.idSupplier || "", {
        skip: !id, // Skip si pas d'ID
    });

    const {
        data: category,
        isLoading: isLoadingCategory,
        isError: isErrorCategory,
        refetch: refetchCategory,
    } = useGetRessourceCategoryByIdQuery(ressource?.idCategory || "", {
        skip: !id, // Skip si pas d'ID
    });

    if (isLoadingRessource || isLoadingSupplier || isLoadingCategory) {
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

    if (isErrorRessource || isErrorSupplier || isErrorCategory) {
        return (
            <Error
                title="Erreur lors du chargement de la ressource"
                description="Impossible de récupérer les détails de la ressource"
                methods={() => {
                    refetchRessource();
                    refetchSupplier();
                    refetchCategory();
                }}
            />
        );
    }

    if (!ressource) {
        return (
            <div className="space-y-4 px-4 lg:px-6">
                <div className="text-center py-8">
                    <p className="text-lg text-muted-foreground">
                        Ressource non trouvée
                    </p>
                </div>
            </div>
        );
    }

    // Générer plusieurs images pour la galerie
    const images = Array.from(
        { length: 4 },
        (_, i) => `https://picsum.photos/400/300?random=${ressource._id + i}`
    );

    console.log(supplier);

    return (
        <div className="space-y-6 px-4 lg:px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section Images */}
                <div className="space-y-4">
                    {/* Image principale */}
                    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                        <img
                            src={images[selectedImage]}
                            alt={ressource.name}
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
                            {ressource.name}
                        </h1>

                        <p className="text-muted-foreground leading-relaxed">
                            {ressource.description ||
                                "Description de la ressource"}
                            .
                        </p>
                        <Badge variant={"default"}>{category?.label}</Badge>
                    </div>

                    {/* Statut */}
                    {/* <div>
                        <Badge
                            variant={
                                ressource.status === "ready_to_sell"
                                    ? "default"
                                    : "secondary"
                            }
                            className={
                                furniture.status === "ready_to_sell"
                                    ? "bg-green-100 text-green-800"
                                    : furniture.status === "in_production"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                            }
                        >
                            {furniture.status === "ready_to_sell"
                                ? "Prêt à vendre"
                                : furniture.status === "in_production"
                                ? "En production"
                                : "En attente"}{" "}
                            - {furniture.quantity} unités
                        </Badge>
                    </div> */}

                    {/* Ressources Nécessaires */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="text-lg">📦</div>{" "}
                            <h3 className="text-lg font-semibold">
                                Produit par
                                {/* {supplier?.name} */}
                            </h3>
                        </div>

                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {supplier && (
                                <ResourceItem
                                    key={supplier._id}
                                    Supplier={supplier}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
