import { Error } from "@/components/Error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetFurnitureByIdQuery } from "@/store/api/furnituresApi";
import {
    Download,
    Drill,
    Droplets,
    Heart,
    Paintbrush,
    Star,
    TreePine,
    Wrench,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const DetailledFurniture = () => {
    //TODO: made and rework this page, keep the same design as the other pages and add the new data from the api (ressources, )

    //TODO : hide breadcrumb when it's a detailled page (ID apparence)

    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);

    // Utilisation de l'API pour récupérer les détails du meuble
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

    const specifications = {
        dimensions: "180 x 90 x 75 cm",
        weight: "45 kg",
        material: "Chêne massif",
        finish: "Vernis naturel",
    };

    const resources = [
        {
            name: "Planches de Chêne",
            quantity: "8 unités",
            description: "Épaisseur 4cm, qualité A",
            icon: TreePine,
            color: "text-orange-600",
        },
        {
            name: "Vis à bois",
            quantity: "24 pièces",
            description: "Ø6mm, tête fraisée",
            icon: Drill,
            color: "text-gray-600",
        },
        {
            name: "Colle à bois",
            quantity: "500ml",
            description: "Résistante à l'humidité",
            icon: Droplets,
            color: "text-blue-600",
        },
        {
            name: "Vernis naturel",
            quantity: "750ml",
            description: "Protection et finition",
            icon: Paintbrush,
            color: "text-purple-600",
        },
        {
            name: "Chevilles en bois",
            quantity: "16 pièces",
            description: "Diamètre 8mm",
            icon: Wrench,
            color: "text-red-600",
        },
    ];

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
                        <p className="text-sm text-muted-foreground mb-4">
                            Référence: FRN-
                            {furniture._id.slice(-3).toUpperCase()}
                        </p>

                        {/* Étoiles */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                (24 avis)
                            </span>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                            {furniture.description || "Description du meuble"}.
                            Parfaite pour 6 à 8 personnes, cette pièce allie
                            tradition et modernité avec ses finitions soignées
                            et sa robustesse exceptionnelle.
                        </p>
                    </div>

                    {/* Spécifications */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Spécifications :
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Dimensions:
                                </span>
                                <span className="font-medium">
                                    {specifications.dimensions}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Poids:
                                </span>
                                <span className="font-medium">
                                    {specifications.weight}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Matériau:
                                </span>
                                <span className="font-medium">
                                    {specifications.material}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Finition:
                                </span>
                                <span className="font-medium">
                                    {specifications.finish}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Statut */}
                    <div>
                        <Badge
                            variant={
                                furniture.status === "ready_to_sell"
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
                    </div>

                    {/* Boutons d'action */}
                    <div className="space-y-3">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger les Plans
                        </Button>
                        <Button variant="outline" className="w-full">
                            <Heart className="w-4 h-4 mr-2" />
                            Ajouter aux Favoris
                        </Button>
                    </div>
                </div>
            </div>

            {/* Ressources Nécessaires */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TreePine className="w-5 h-5 text-green-600" />
                        Ressources Nécessaires
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {furniture.ressources && furniture.ressources.length > 0
                            ? furniture.ressources.map((resource, index) => (
                                  <div
                                      key={index}
                                      className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
                                  >
                                      <TreePine className="w-5 h-5 mt-0.5 text-green-600" />
                                      <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                              <h4 className="font-medium">
                                                  Ressource{" "}
                                                  {resource.idRessource}
                                              </h4>
                                              <span className="text-sm font-semibold text-primary">
                                                  {resource.quantity} unités
                                              </span>
                                          </div>
                                          <p className="text-xs text-muted-foreground mt-1">
                                              ID: {resource._id}
                                          </p>
                                      </div>
                                  </div>
                              ))
                            : resources.map((resource, index) => (
                                  <div
                                      key={index}
                                      className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
                                  >
                                      <resource.icon
                                          className={`w-5 h-5 mt-0.5 ${resource.color}`}
                                      />
                                      <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                              <h4 className="font-medium">
                                                  {resource.name}
                                              </h4>
                                              <span className="text-sm font-semibold text-primary">
                                                  {resource.quantity}
                                              </span>
                                          </div>
                                          <p className="text-xs text-muted-foreground mt-1">
                                              {resource.description}
                                          </p>
                                      </div>
                                  </div>
                              ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
