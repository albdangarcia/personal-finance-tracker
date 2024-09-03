import { fetchCategories } from "@/app/lib/data/categories";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import FormWrapper from "@/app/ui/form-wrapper";
import CreateIncomeForm from "@/app/ui/incomes/create-form";

const breadcrumbs = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Incomes",
        href: "/dashboard/incomes",
    },
    {
        label: "Create",
        href: "/dashboard/incomes/create",
    },
];

// Page for creating an income
const Page = async () => {
    // Fetch all categories from the database
    const categories = await fetchCategories();

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <FormWrapper
                title="Income"
                description="Please provide the details for your income below."
            >
                {/* Pass categories to the Form component */}
                <CreateIncomeForm categories={categories} />
            </FormWrapper>
        </div>
    );
}

export default Page;