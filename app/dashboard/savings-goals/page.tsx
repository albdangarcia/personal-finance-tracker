import { fetchSavingGoalsByCategories } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
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

const Page = async () => {
    const categoriesWithGoals = await fetchSavingGoalsByCategories();
    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <CategoriesTable categoriesWithGoals={categoriesWithGoals} />
        </div>
    );
};

export default Page;
