import { fetchCategories } from "@/app/lib/data/categories";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import CreateDebtForm from "@/app/ui/debts/create-form";
import FormWrapper from "@/app/ui/form-wrapper";

const breadcrumbs = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Debts",
        href: "/dashboard/debts",
    },
    {
        label: "Create",
        href: "/dashboard/debts/create",
    },
];

const Page = async () => {
    // Fetch all categories from the database
    const categories = await fetchCategories();

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <FormWrapper
                title="Debt"
                description="Please provide the details for your debt below."
            >
                {/* Pass categories to the Form component */}
                <CreateDebtForm categories={categories} />
            </FormWrapper>
        </div>
    );
}

export default Page;