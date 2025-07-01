import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "@/components/layout/data/data.json";

export const Dashboard = () => {
    //TODO : change charts for 1 or 2 charts
    //TODO : change the data in the charts
    //TODO : change or find other data to display in the table, or remove the table

    //TODO : maybe an idea : words with recent changes to have a direct link to the page (history page with the changes and a redirection to the page)

    return (
        <>
            <SectionCards />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
        </>
    );
};
