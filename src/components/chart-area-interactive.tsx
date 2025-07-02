import * as React from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

import { useGetAllFurnituresQuery } from "@/store/api/furnituresApi";
import { useGetAllRessourcesQuery } from "@/store/api/ressourcesApi";
import { useGetAllSuppliersQuery } from "@/store/api/suppliersApi";
import { Error } from "./Error";

export const description = "Interactive charts with real API data";

const chartConfig = {
    furnitures: {
        label: "Meubles",
        color: "hsl(var(--chart-1))",
    },
    ressources: {
        label: "Ressources",
        color: "hsl(var(--chart-2))",
    },
    suppliers: {
        label: "Fournisseurs",
        color: "hsl(var(--chart-3))",
    },
    waiting: {
        label: "En attente",
        color: "hsl(var(--chart-4))",
    },
    in_production: {
        label: "En production",
        color: "hsl(var(--chart-1))",
    },
    ready_to_sell: {
        label: "Prêt à vendre",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
    const {
        data: furnitures,
        isLoading: isFurnituresLoading,
        isError: isFurnituresError,
        refetch: refetchFurnitures,
    } = useGetAllFurnituresQuery();
    const {
        data: ressources,
        isLoading: isRessourcesLoading,
        isError: isRessourcesError,
        refetch: refetchRessources,
    } = useGetAllRessourcesQuery();
    const {
        data: suppliers,
        isLoading: isSuppliersLoading,
        isError: isSuppliersError,
        refetch: refetchSuppliers,
    } = useGetAllSuppliersQuery();

    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState("90d");

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d");
        }
    }, [isMobile]);

    if (isFurnituresLoading || isRessourcesLoading || isSuppliersLoading) {
        return <div>Loading...</div>;
    }
    if (isFurnituresError || isRessourcesError || isSuppliersError) {
        return (
            <Error
                title="Erreur"
                description="Erreur lors de la récupération des données"
                methods={() => {
                    refetchFurnitures();
                    refetchRessources();
                    refetchSuppliers();
                }}
            />
        );
    }

    const createTimelineData = () => {
        const allDates: {
            [key: string]: {
                furnitures: number;
                ressources: number;
                suppliers: number;
                date: string;
            };
        } = {};

        furnitures?.forEach((furniture) => {
            const date = new Date(furniture.createdAt)
                .toISOString()
                .split("T")[0];
            if (!allDates[date]) {
                allDates[date] = {
                    furnitures: 0,
                    ressources: 0,
                    suppliers: 0,
                    date,
                };
            }
            allDates[date].furnitures += 1;
        });

        ressources?.forEach((ressource) => {
            const date = new Date(ressource.createdAt)
                .toISOString()
                .split("T")[0];
            if (!allDates[date]) {
                allDates[date] = {
                    furnitures: 0,
                    ressources: 0,
                    suppliers: 0,
                    date,
                };
            }
            allDates[date].ressources += 1;
        });

        suppliers?.forEach((supplier) => {
            const date = new Date(supplier.createdAt)
                .toISOString()
                .split("T")[0];
            if (!allDates[date]) {
                allDates[date] = {
                    furnitures: 0,
                    ressources: 0,
                    suppliers: 0,
                    date,
                };
            }
            allDates[date].suppliers += 1;
        });

        return Object.values(allDates).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    };

    const createStatusData = () => {
        const statusCounts = { waiting: 0, in_production: 0, ready_to_sell: 0 };

        furnitures?.forEach((furniture) => {
            if (furniture.status in statusCounts) {
                statusCounts[
                    furniture.status as keyof typeof statusCounts
                ] += 1;
            }
        });

        return [
            {
                status: "waiting",
                count: statusCounts.waiting,
                label: "En attente",
            },
            {
                status: "in_production",
                count: statusCounts.in_production,
                label: "En production",
            },
            {
                status: "ready_to_sell",
                count: statusCounts.ready_to_sell,
                label: "Prêt à vendre",
            },
        ];
    };

    const timelineData = createTimelineData();
    const statusData = createStatusData();

    const filteredTimelineData = timelineData.filter((item) => {
        const date = new Date(item.date);
        const now = new Date();
        let daysToSubtract = 90;
        if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "7d") {
            daysToSubtract = 7;
        }
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
    });

    return (
        <div className="space-y-6">
            {/* Chart 1: Timeline des créations */}
            <Card className="@container/card">
                <CardHeader>
                    <CardTitle>Évolution des créations</CardTitle>
                    <CardDescription>
                        <span className="hidden @[540px]/card:block">
                            Nombre d'éléments créés au fil du temps
                        </span>
                        <span className="@[540px]/card:hidden">
                            Créations dans le temps
                        </span>
                    </CardDescription>
                    <CardAction>
                        <ToggleGroup
                            type="single"
                            value={timeRange}
                            onValueChange={(value) => {
                                if (value) setTimeRange(value);
                            }}
                            variant="outline"
                            className="hidden md:flex"
                        >
                            <ToggleGroupItem
                                value="90d"
                                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                            >
                                3 derniers mois
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="30d"
                                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                            >
                                30 derniers jours
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="7d"
                                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                            >
                                7 derniers jours
                            </ToggleGroupItem>
                        </ToggleGroup>
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger
                                className="w-40 md:hidden"
                                size="sm"
                                aria-label="Select a value"
                            >
                                <SelectValue placeholder="3 derniers mois" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="90d" className="rounded-lg">
                                    3 derniers mois
                                </SelectItem>
                                <SelectItem value="30d" className="rounded-lg">
                                    30 derniers jours
                                </SelectItem>
                                <SelectItem value="7d" className="rounded-lg">
                                    7 derniers jours
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </CardAction>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <AreaChart data={filteredTimelineData}>
                            <defs>
                                <linearGradient
                                    id="fillFurnitures"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-furnitures)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-furnitures)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="fillRessources"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-ressources)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-ressources)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="fillSuppliers"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-suppliers)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-suppliers)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString("fr-FR", {
                                        month: "short",
                                        day: "numeric",
                                    });
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(
                                                value
                                            ).toLocaleDateString("fr-FR", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            });
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                dataKey="furnitures"
                                type="natural"
                                fill="url(#fillFurnitures)"
                                stroke="var(--color-furnitures)"
                                stackId="a"
                            />
                            <Area
                                dataKey="ressources"
                                type="natural"
                                fill="url(#fillRessources)"
                                stroke="var(--color-ressources)"
                                stackId="a"
                            />
                            <Area
                                dataKey="suppliers"
                                type="natural"
                                fill="url(#fillSuppliers)"
                                stroke="var(--color-suppliers)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Chart 2: Distribution des statuts des meubles */}
            <Card className="@container/card">
                <CardHeader>
                    <CardTitle>Statuts des meubles</CardTitle>
                    <CardDescription>
                        Distribution des meubles par statut de production
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <BarChart data={statusData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent indicator="dashed" />
                                }
                            />
                            <Bar
                                dataKey="count"
                                fill="var(--color-waiting)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
