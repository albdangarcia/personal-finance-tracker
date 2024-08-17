import BudgetChart from "@/app/ui/budgets/budget-chart";
import { fetchUsedCategoryWithBudget } from "@/app/lib/data";
import BudgetCards from "@/app/ui/budgets/budget-cards";
import { SectionHeader, SectionWrapper } from "@/app/ui/page-section-wrapper";

const Page = async () => {
    // get all the budgets by category
    const budgetData = await fetchUsedCategoryWithBudget();

    return (
        <div>
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
