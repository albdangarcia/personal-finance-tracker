import BudgetChart from "@/app/ui/budgets/budget-chart";
import { fetchUsedCategoryWithBudget } from "@/app/lib/data/budget";
import BudgetCards from "@/app/ui/budgets/budget-cards";
import {
    MainWrapper,
    SectionHeader,
    SectionWrapper,
} from "@/app/ui/page-section-wrapper";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import BudgetMonthChart from "@/app/ui/budgets/budgets-month-chart";
import SearchBar from "@/app/ui/search-bar";

const breadcrumbs = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Budgets",
        href: "/dashboard/budgets",
    },
];

type PageProps = {
    searchParams?: {
        query?: string;
        page?: string;
    }
};

const Page = async ({ searchParams }: PageProps) => {
    // Get the query from the search params
    const query = searchParams?.query || "";

    // Fetch the budget data
    const budgetData = await fetchUsedCategoryWithBudget(query);

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <MainWrapper>
                <SectionWrapper>
                    <SectionHeader
                        title="Doughnut Chart"
                        subtitle="All the expenses by category."
                    />
                    <BudgetChart budgetData={budgetData} />
                </SectionWrapper>

                <SectionWrapper>
                    <SectionHeader
                        title="Months"
                        subtitle="All the budgets by month."
                    />
                    <BudgetMonthChart budgetData={budgetData} />
                </SectionWrapper>

                <div className="sm:col-span-2">
                    <SectionWrapper>
                        <SectionHeader
                            title="Budgets"
                            subtitle="All the budgets you have added are listed here."
                            buttonLink="/dashboard/budgets/create"
                        />
                        {/* Search bar */}
                        <div className="w-80 mt-1 mb-9">
                            <SearchBar placeholder="Seach category" />
                        </div>
                        {/* Budget Cards */}
                        <BudgetCards budgetData={budgetData} />
                    </SectionWrapper>
                </div>
            </MainWrapper>
        </div>
    );
};

export default Page;
