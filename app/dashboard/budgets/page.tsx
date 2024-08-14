import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import BudgetChart from "@/app/ui/budgets/budget-chart";
import { fetchUsedCategoryWithBudget } from "@/app/lib/data";
import BudgetCards from "@/app/ui/budgets/budget-cards";

const Page = async () => {
  // get all the budgets by category
  const budgetData = await fetchUsedCategoryWithBudget();
  
  return (
    <div>
      {/* Budget Chart */}
      <BudgetChart budgetData={budgetData} />
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <Link
          href="/dashboard/budgets/create"
          className="bg-blue-600 rounded flex h-9 w-9 text-white justify-center items-center hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
        </Link>
      </div>
      {/* Budget Cards */}
      <BudgetCards budgetData={budgetData} />
    </div>
  );
};

export default Page;
