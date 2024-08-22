import BudgetChart from "@/app/ui/budgets/budget-chart";
import { fetchFilteredBudgets } from "@/app/lib/data/budget";
import BudgetCards from "@/app/ui/budgets/budget-cards";
import {
    MainWrapper,
    SectionHeader,
    SectionWrapper,
} from "@/app/ui/page-section-wrapper";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import BudgetMonthChart from "@/app/ui/budgets/budgets-month-chart";
import SearchBar from "@/app/ui/search-bar";
import YearMonthInput from "@/app/ui/year-month-input";

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
        month?: string;
        year?: string;
    };
};

const Page = async ({ searchParams }: PageProps) => {
    // Get the query from the search params
    const query = searchParams?.query || "";

    const month = searchParams?.month || "";
    const year = searchParams?.year || "";

    // Fetch the budget data
    const budgetData = await fetchFilteredBudgets(query, year, month);

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
                        <div className="flex gap-x-3 mt-1 mb-9 justify-between">
                            {/* Search bar */}
                            <div className="w-80">
                                <SearchBar placeholder="Seach category" />
                            </div>
                            <div>
                                <YearMonthInput />
                            </div>
                        </div>

                        {/* Budget Cards */}
                        {budgetData.length > 0 ? (
                            <BudgetCards budgetData={budgetData} />
                        ) : (
                            <div className="font-medium text-center text-gray-400/70">
                                <p>No budgets</p>
                            </div>
                        )}
                    </SectionWrapper>
                </div>
            </MainWrapper>
        </div>
    );
};

export default Page;
