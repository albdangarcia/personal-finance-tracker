import { fetchSavingGoalsByCategories } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import CategoriesTable from "@/app/ui/savings-goals/categories-table";

const Page = async () => {
    const categoriesWithGoals = await fetchSavingGoalsByCategories();
    return (
        <div>
            <Breadcrumbs
                breadcrumbs={[
                    {
                        label: "Dashboard",
                        href: "/dashboard/savings-goals",
                    },
                    {
                        label: "Savings Goals",
                        href: "/dashboard/savings-goals",
                        active: true,
                    },
                ]}
            />
            <CategoriesTable categoriesWithGoals={categoriesWithGoals} />
        </div>
    );
};

export default Page;
