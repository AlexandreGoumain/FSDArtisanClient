import { type Icon } from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
    items,
    currentPath,
}: {
    items: {
        title: string;
        url: string;
        icon?: Icon | LucideIcon;
    }[];
    currentPath: string;
}) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive =
                            currentPath === item.url ||
                            (item.url !== "/" &&
                                currentPath.startsWith(item.url));

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    className={
                                        isActive
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground min-w-8 duration-200 ease-linear"
                                    }
                                >
                                    <Link to={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
