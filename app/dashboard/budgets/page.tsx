import BudgetChart from "@/app/ui/budgets/budget-chart";
import { fetchUsedCategoryWithBudget } from "@/app/lib/data";
import BudgetCards from "@/app/ui/budgets/budget-cards";
import CreateButton from "@/app/ui/create-new-button";

const Page = async () => {
    // get all the budgets by category
    const budgetData = await fetchUsedCategoryWithBudget();

    return (
        <div>
            {/* Budget Chart */}
            <BudgetChart budgetData={budgetData} />

            <div className="antialiased mt-6 bg-white border border-gray-200 rounded-md shadow-sm pb-4 pt-10 px-8">
                <div className="flex justify-between">
                    <div>
                        <h4 className="font-medium">Budgets</h4>
                        <p className="mt-2.5 mb-5 text-sm text-gray-500">
                            All the budgets you have added are listed here.
                        </p>
                    </div>
                    <CreateButton hrefLink="/dashboard/expenses/create" />
                </div>
                {/* Budget Cards */}
                <BudgetCards budgetData={budgetData} />
            </div>
        </div>
    );
};

export default Page;
