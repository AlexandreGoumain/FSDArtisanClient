import { useGetRessourceByIdQuery } from "@/store/api/ressourcesApi";
import { useParams } from "react-router-dom";
import { Error } from "@/components/Error";
import { useGetRessourceCategoryByIdQuery } from "@/store/api/ressourcesCategoriesApi";
import { useGetSupplierByIdQuery } from "@/store/api/suppliersApi";
import { Button } from "@/components/ui/button";

export const DetailledRessource = () => {
  const { id } = useParams();

  // Utilisation de l'API pour récupérer les détails du meuble
  const {
    data: ressource,
    isLoading,
    isError,
    refetch,
  } = useGetRessourceByIdQuery(id || "", {
    skip: !id, // Skip si pas d'ID
  });

  const { data: supplier } = useGetSupplierByIdQuery(
    ressource?.idSupplier || "",
    {
      skip: !id, // Skip si pas d'ID
    }
  );

  const { data: category } = useGetRessourceCategoryByIdQuery(
    ressource?.idCategory || "",
    {
      skip: !id, // Skip si pas d'ID
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-4 px-4 lg:px-6">
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Error
        title="Erreur lors du chargement de la ressource"
        description="Impossible de récupérer les détails de la ressource"
        methods={refetch}
      />
    );
  }

  if (!ressource) {
    return (
      <div className="space-y-4 px-4 lg:px-6">
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">Ressource non trouvée</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <p>Npm : {ressource.name}</p>
      <p>Description : {ressource.description}</p>
      <p>Catégorie : {category?.label}</p>
      <p>Fournisseur : {supplier?.name}</p>
    </>
  );
};
