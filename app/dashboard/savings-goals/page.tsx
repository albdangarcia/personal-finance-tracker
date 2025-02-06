import {
    fetchFilteredSavingGoals,
    fetchGroupedSavingsGoals,
    fetchSavingsGoalsPages,
} from "@/app/lib/data/savings-goal";
import { SearchParamsType } from "@/app/lib/interfaces";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import {
    MainWrapper,
    SectionHeader,
    SectionWrapper,
} from "@/app/ui/page-section-wrapper";
import CategoryChart from "@/app/ui/savings-goals/categories-chart";
import CategoriesTable from "@/app/ui/savings-goals/categories-table";

const breadcrumbs = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Savings Goals",
        href: "/dashboard/savings-goals",
    },
];

interface Props {
    searchParams: Promise<SearchParamsType>
}

const Page = async ({ searchParams }: Props) => {
    const { query = '', page = '1' } = await searchParams;
    const currentPage = Number(page);
    
    const totalPages = await fetchSavingsGoalsPages(query);

    const categoriesWithGoals = await fetchFilteredSavingGoals(
        query,
        currentPage
    );
    const savingGoalsData = await fetchGroupedSavingsGoals();

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <MainWrapper>
                <div className="col-span-2">
                    <SectionWrapper>
                        <SectionHeader
                            title="Categories"
                            subtitle="Saving goals by category."
                        />
                        <CategoryChart savingGoalsData={savingGoalsData} />
                    </SectionWrapper>
                </div>

                <div className="sm:col-span-2">
                    <CategoriesTable
                        categoriesWithGoals={categoriesWithGoals}
                        totalPages={totalPages}
                    />
                </div>
            </MainWrapper>
        </div>
    );
};

export default Page;
