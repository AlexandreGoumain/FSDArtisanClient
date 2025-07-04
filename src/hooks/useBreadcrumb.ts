import { useRouting } from "./useRouting";

interface BreadcrumbItem {
    label: string;
    path: string;
    isActive: boolean;
}

export const useBreadcrumb = () => {
    const { currentPath, goTo } = useRouting();

    const getBreadcrumbs = (): BreadcrumbItem[] => {
        const pathSegments = currentPath.split("/").filter(Boolean);
        const breadcrumbs: BreadcrumbItem[] = [
            {
                label: "Accueil",
                path: "/",
                isActive: pathSegments.length === 0,
            },
        ];

        let currentPathBuilder = "";
        pathSegments.forEach((segment, index) => {
            currentPathBuilder += `/${segment}`;
            const isLast = index === pathSegments.length - 1;

            let label = segment;

            const routeLabels: Record<string, string> = {
                furnitures: "Meubles",
                suppliers: "Fournisseurs",
                ressources: "Ressources",
                categories: "Catégories",
                create: "Créer",
                edit: "Modifier",
                dashboard: "Tableau de bord",
                auth: "Authentification",
                login: "Connexion",
            };

            if (routeLabels[segment]) {
                label = routeLabels[segment];
            } else {
                label = segment.charAt(0).toUpperCase() + segment.slice(1);
            }

            breadcrumbs.push({
                label,
                path: currentPathBuilder,
                isActive: isLast,
            });
        });

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    const navigateTo = (path: string) => {
        goTo(path);
    };

    return {
        breadcrumbs,
        navigateTo,
        currentPath,
    };
};
