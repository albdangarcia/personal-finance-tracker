import {
    fetchFilteredIncomes,
    fetchIncomeByCategory,
} from "@/app/lib/data/income";
import { SearchParamsType } from "@/app/lib/interfaces";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import IncomeChart from "@/app/ui/incomes/doughnut-chart";
import IncomesTable from "@/app/ui/incomes/incomes-table";
import IncomeCategoryChart from "@/app/ui/incomes/pie-chart";
import {
    MainWrapper,
    SectionHeader,
    SectionWrapper,
} from "@/app/ui/page-section-wrapper";

const breadcrumbs = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Incomes",
        href: "/dashboard/incomes",
    },
];

interface Props {
    searchParams: Promise<SearchParamsType>
}

const Page = async ({ searchParams }: Props) => {
    // Get the query from the URL
    const { query = "" } = await searchParams;

    const { regularIncomes, irregularIncomes } = await fetchFilteredIncomes(
        query
    );

    const incomesByCategories = await fetchIncomeByCategory();

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <MainWrapper>
                <SectionWrapper>
                    <SectionHeader
                        title="Income types"
                        subtitle="Incomes by regular and irregular."
                    />
                    <IncomeChart
                        regularIncomes={regularIncomes}
                        irregularIncomes={irregularIncomes}
                    />
                </SectionWrapper>

                <SectionWrapper>
                    <SectionHeader
                        title="Categories"
                        subtitle="Incomes by category."
                    />
                    <IncomeCategoryChart incomeData={incomesByCategories} />
                </SectionWrapper>

                <div className="sm:col-span-2">
                    <IncomesTable
                        regularIncomes={regularIncomes}
                        irregularIncomes={irregularIncomes}
                    />
                </div>
            </MainWrapper>
        </div>
    );
};

export default Page;
