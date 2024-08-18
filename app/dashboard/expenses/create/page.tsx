import { fetchCategories } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import CreateExpenseForm from "@/app/ui/expenses/create-form";
import FormWrapper from "@/app/ui/form-wrapper";

const breadcrumbs = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Expenses",
        href: "/dashboard/expenses",
    },
    {
        label: "Create",
        href: "/dashboard/expenses/create",
    },
];

// Page for creating a expense
const Page = async () => {
    // Fetch all categories from the database
    const categories = await fetchCategories();

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <FormWrapper
                title="Expense"
                description="Please provide the details for your expense below."
            >
                {/* Pass categories to the Form component */}
                <CreateExpenseForm categories={categories} />
            </FormWrapper>
        </div>
    );
};

export default Page;
