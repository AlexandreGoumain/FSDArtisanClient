import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { ChevronRight } from "lucide-react";

export function SiteHeader() {
    const { breadcrumbs, navigateTo } = useBreadcrumb();

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />

                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((breadcrumb, index) => (
                            <div
                                key={breadcrumb.path}
                                className="flex items-center"
                            >
                                <BreadcrumbItem>
                                    {breadcrumb.isActive ? (
                                        <span className="font-medium text-foreground">
                                            {breadcrumb.label}
                                        </span>
                                    ) : (
                                        <BreadcrumbLink
                                            onClick={() =>
                                                navigateTo(breadcrumb.path)
                                            }
                                            className="cursor-pointer hover:text-foreground transition-colors"
                                        >
                                            {breadcrumb.label}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && (
                                    <BreadcrumbSeparator>
                                        <ChevronRight className="h-4 w-4" />
                                    </BreadcrumbSeparator>
                                )}
                            </div>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
}
