import { BoxIcon, SofaIcon, TruckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { getDifferencePercentageByPeriod } from "@/lib/utils";

import type { Furniture, Ressource, Supplier } from "@/store/api/types";

const setDescriptionGrowOrDown = (percentage: number) => {
    if (percentage === 0) return "aucune variation";
    if (percentage > 0) return `En hausse de ${percentage}% sur le mois`;
    return `En baisse de ${percentage}% sur le mois`;
};

export function SectionCards({
    ressources,
    furnitures,
    suppliers,
}: {
    ressources: Ressource[];
    furnitures: Furniture[];
    suppliers: Supplier[];
}) {
    const getTotalFurnitureQuantity = () => {
        return furnitures.reduce(
            (total, furniture) => total + furniture.quantity,
            0
        );
    };

    const totalFurnitureQuantity = getTotalFurnitureQuantity();

    const data = [
        {
            title: "Total Meubles",
            value: totalFurnitureQuantity,
            percentageGrowThisMonth: getDifferencePercentageByPeriod(
                totalFurnitureQuantity,
                totalFurnitureQuantity + 10
            ),
            description: setDescriptionGrowOrDown(
                getDifferencePercentageByPeriod(
                    totalFurnitureQuantity,
                    totalFurnitureQuantity - 5
                ).percentage
            ),
            icon: SofaIcon,
            color: "bg-primary",
            borderColor: "border-primary",
        },
        {
            title: "Fournisseurs",
            value: suppliers.length,
            percentageGrowThisMonth: getDifferencePercentageByPeriod(
                suppliers.length,
                suppliers.length + 50
            ),
            description: setDescriptionGrowOrDown(
                getDifferencePercentageByPeriod(
                    suppliers.length,
                    suppliers.length + 50
                ).percentage
            ),
            icon: TruckIcon,
            color: "bg-primary",
            borderColor: "border-primary",
        },
        {
            title: "Ressources",
            value: ressources.length,
            percentageGrowThisMonth: getDifferencePercentageByPeriod(
                ressources.length,
                ressources.length + 0
            ),
            description: setDescriptionGrowOrDown(
                getDifferencePercentageByPeriod(
                    ressources.length,
                    ressources.length + 0
                ).percentage
            ),
            icon: BoxIcon,
            color: "bg-primary",
            borderColor: "border-primary",
        },
    ];

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-3">
            {data &&
                data.map((item, index) => (
                    <Card key={index} className="@container/card">
                        <CardHeader>
                            <CardDescription className="text-2xl">
                                {item.title}
                            </CardDescription>
                            <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {item.value}
                            </CardTitle>
                            <CardAction>
                                <Badge
                                    variant="default"
                                    className="bg-primary text-white p-2"
                                >
                                    <item.icon className="!w-6 !h-6" />
                                </Badge>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1.5 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium">
                                {item.description}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
        </div>
    );
}
