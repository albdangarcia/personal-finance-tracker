import { fetchSavingGoalsByCategories } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import {
    MainWrapper,
    SectionHeader,
    SectionWrapper,
} from "@/app/ui/page-section-wrapper";
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
            <MainWrapper>
                <div className="sm:col-span-2">
                    <CategoriesTable
                        categoriesWithGoals={categoriesWithGoals}
                    />
                </div>
            </MainWrapper>
        </div>
    );
};

export default Page;
