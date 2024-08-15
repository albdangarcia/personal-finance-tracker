import { fetchSavingGoalsByCategories } from "@/app/lib/data";
import CategoriesTable from "@/app/ui/savings-goals/categories-table";

const Page = async () => {
    // const savingsGoals = await fetchSavingGoals();
    const categoriesWithGoals = await fetchSavingGoalsByCategories();
    return (
        <div>
            <CategoriesTable categoriesWithGoals={categoriesWithGoals} />
        </div>
    );
};

export default Page;
