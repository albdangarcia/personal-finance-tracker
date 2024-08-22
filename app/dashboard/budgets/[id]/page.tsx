import { fetchBudgetById } from "@/app/lib/data/budget";
import EditBudgetForm from "@/app/ui/budgets/edit-form";
import { notFound } from "next/navigation";
import FormWrapper from "@/app/ui/form-wrapper";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { fetchCategories } from "@/app/lib/data/categories";

const breadcrumbs = (id: string) => [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Budgets",
        href: "/dashboard/budgets",
    },
    {
        label: "Edit",
        href: `/dashboard/budgets/${id}`,
    },
];

// Page for editing a budget
const Page = async ({ params }: { params: { id: string } }) => {
    // get id from params
    const id = params.id;

    // get all available categories
    const categories = await fetchCategories();
    
    // get budget by id
    const budget = await fetchBudgetById(id);
    
    // if budget is not found, return nextjs default not found page
    if (!budget) {
        return notFound();
    }

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs(id)} />
            <FormWrapper title="Budget" description="Modify the information for your Budget.">
                <EditBudgetForm budget={budget} categories={categories} />
            </FormWrapper>
        </div>
    );
};

export default Page;
