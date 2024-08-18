import BudgetChart from "@/app/ui/budgets/budget-chart";
import { fetchUsedCategoryWithBudget } from "@/app/lib/data";
import BudgetCards from "@/app/ui/budgets/budget-cards";
import { SectionHeader, SectionWrapper } from "@/app/ui/page-section-wrapper";
import Breadcrumbs from "@/app/ui/breadcrumbs";

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

const Page = async () => {
    // get all the budgets by category
    const budgetData = await fetchUsedCategoryWithBudget();

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            {/* Budget Chart */}
            <BudgetChart budgetData={budgetData} />

            <SectionWrapper>
                <SectionHeader
                    title="Budgets"
                    subtitle="All the budgets you have added are listed here."
                    buttonLink="/dashboard/budgets/create"
                />
                {/* Budget Cards */}
                <BudgetCards budgetData={budgetData} />
            </SectionWrapper>
        </div>
    );
};

export default Page;
