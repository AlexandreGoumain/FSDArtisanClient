import {
    IconCamera,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconHelp,
    IconInnerShadowTop,
    IconPackage,
    IconReport,
    IconSearch,
    IconSettings,
    IconSofa,
    IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
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

const data = {
    user: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
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
            title: "Matériaux",
            url: "/materials",
            icon: IconPackage,
        },
        {
            title: "Fournisseurs",
            url: "/suppliers",
            icon: IconUsers,
        },
    ],
    navClouds: [
        {
            title: "Capture",
            icon: IconCamera,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Proposal",
            icon: IconFileDescription,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Prompts",
            icon: IconFileAi,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp,
        },
        {
            title: "Search",
            url: "#",
            icon: IconSearch,
        },
    ],
    documents: [
        {
            name: "Data Library",
            url: "#",
            icon: IconDatabase,
        },
        {
            name: "Reports",
            url: "#",
            icon: IconReport,
        },
        {
            name: "Word Assistant",
            url: "#",
            icon: IconFileWord,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { currentPath } = useRouting();

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
                <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
