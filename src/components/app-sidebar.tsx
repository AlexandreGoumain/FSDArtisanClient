import {
    IconDashboard,
    IconInnerShadowTop,
    IconSofa,
    IconUsers,
} from "@tabler/icons-react";
import { BrickWall } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouting } from "@/hooks/useRouting";
import { useGetMeUserQuery } from "@/store/api/usersApi";
import { Error } from "./Error";

const data = {
    navMain: [
        {
            title: "Tableau de bord",
            url: "/",
            icon: IconDashboard,
        },
        {
            title: "Mes meubles",
            url: "/furnitures",
            icon: IconSofa,
        },
        {
            title: "Fournisseurs",
            url: "/suppliers",
            icon: IconUsers,
        },
        {
            title: "Ressources",
            url: "/ressources",
            icon: BrickWall,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { currentPath } = useRouting();
    const {
        data: user,
        isLoading,
        isError,
        refetch: refetchMeUser,
    } = useGetMeUserQuery();

    if (isLoading) return <div>Loading...</div>;

    if (isError)
        return (
            <Error
                title="Erreur lors de la récupération de l'utilisateur"
                description="Veuillez réessayer plus tard"
                methods={refetchMeUser}
            />
        );

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="/">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">
                                    Artisan Client
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} currentPath={currentPath} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user?.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
