import { fetchCategories } from "@/app/lib/data/categories";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import CreateBudgetForm from "@/app/ui/budgets/create-form";
import FormWrapper from "@/app/ui/form-wrapper";

const breadcrumbs = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Budgets",
        href: "/dashboard/budgets",
    },
    {
        label: "Create",
        href: "/dashboard/budgets/create",
    },
];

// Page for creating a budget
const Page = async () => {
    // Fetch categories from the database
    const categories = await fetchCategories();

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <FormWrapper title="Budget" description="Please provide the details for your Budget below.">
                {/* Pass categories to the Form component */}
                <CreateBudgetForm categories={categories} />
            </FormWrapper>
        </div>
    );
};

export default Page;
