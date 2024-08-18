import { fetchCategories } from "@/app/lib/data";
import CreateSavingsGoalForm from "@/app/ui/savings-goals/create-form";
import FormWrapper from "@/app/ui/form-wrapper";
import Breadcrumbs from "@/app/ui/breadcrumbs";

const breadcrumbs = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Savings Goals",
        href: "/dashboard/savings-goals",
    },
    {
        label: "Create",
        href: "/dashboard/savings-goals/create",
    },
];

// Page for creating a Savings Goal
const Page = async () => {
    // Fetch all categories from the database
    const categories = await fetchCategories();

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <FormWrapper
                title="Savings Goal"
                description="Please provide the details for your savings goal below."
            >
                {/* Pass categories to the Form component */}
                <CreateSavingsGoalForm categories={categories} />
            </FormWrapper>
        </div>
    );
};

export default Page;
