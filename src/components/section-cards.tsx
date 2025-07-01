import { IconRecycle, IconSofa, IconTruck } from "@tabler/icons-react";

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

const setDescriptionGrowOrDown = (percentage: number) => {
    if (percentage === 0) return "aucune variation";
    if (percentage > 0) return `En hausse de ${percentage}%`;
    return `En baisse de ${percentage}%`;
};

const data = [
    {
        title: "Total Meubles",
        value: 100,
        percentageGrowThisMonth: getDifferencePercentageByPeriod(100, 110),
        description: setDescriptionGrowOrDown(
            getDifferencePercentageByPeriod(100, 110).percentage
        ),
        icon: IconSofa,
        color: "bg-primary",
        borderColor: "border-primary",
    },
    {
        title: "Fournisseurs",
        value: 52,
        percentageGrowThisMonth: getDifferencePercentageByPeriod(52, 50),
        description: setDescriptionGrowOrDown(
            getDifferencePercentageByPeriod(52, 50).percentage
        ),
        icon: IconTruck,
        color: "bg-primary",
        borderColor: "border-primary",
    },
    {
        title: "Matériaux",
        value: 12,
        percentageGrowThisMonth: getDifferencePercentageByPeriod(12, 10),
        description: setDescriptionGrowOrDown(
            getDifferencePercentageByPeriod(12, 10).percentage
        ),
        icon: IconRecycle,
        color: "bg-primary",
        borderColor: "border-primary",
    },
    {
        title: "Matériaux",
        value: 12,
        percentageGrowThisMonth: getDifferencePercentageByPeriod(12, 10),
        description: setDescriptionGrowOrDown(
            getDifferencePercentageByPeriod(12, 10).percentage
        ),
        icon: IconSofa,
        color: "bg-primary",
        borderColor: "border-primary",
    },
];

export function SectionCards() {
    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {data &&
                data.map((item) => (
                    <Card className="@container/card">
                        <CardHeader>
                            <CardDescription>{item.title}</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {item.value}
                            </CardTitle>
                            <CardAction>
                                <Badge
                                    variant="outline"
                                    className="flex bg-primary text-white p-2"
                                >
                                    <item.icon className="size-18" />
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
