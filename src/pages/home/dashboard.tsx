import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";

import { Error } from "@/components/Error";
import { useGetAllFurnituresQuery } from "@/store/api/furnituresApi";
import { useGetAllRessourcesQuery } from "@/store/api/ressourcesApi";
import { useGetAllSuppliersQuery } from "@/store/api/suppliersApi";

export const Dashboard = () => {
    const {
        data: ressources,
        isLoading: isRessourcesLoading,
        isError: isRessourcesError,
        refetch: refetchRessources,
    } = useGetAllRessourcesQuery();
    const {
        data: furnitures,
        isLoading: isFurnituresLoading,
        isError: isFurnituresError,
        refetch: refetchFurnitures,
    } = useGetAllFurnituresQuery();

    const {
        data: suppliers,
        isLoading: isSuppliersLoading,
        isError: isSuppliersError,
        refetch: refetchSuppliers,
    } = useGetAllSuppliersQuery();

    if (isRessourcesLoading || isFurnituresLoading || isSuppliersLoading) {
        return <div>Loading...</div>;
    }
    if (isRessourcesError || isFurnituresError || isSuppliersError) {
        return (
            <Error
                title="Erreur"
                description="Erreur lors de la récupération des données"
                methods={() => {
                    refetchRessources();
                    refetchFurnitures();
                    refetchSuppliers();
                }}
            />
        );
    }

    return (
        <>
            <SectionCards
                ressources={ressources || []}
                furnitures={furnitures || []}
                suppliers={suppliers || []}
            />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
        </>
    );
};
