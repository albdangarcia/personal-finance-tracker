import { fetchExpenseById } from "@/app/lib/data/expense";
import { fetchCategories } from "@/app/lib/data/categories";
import FormWrapper from "@/app/ui/form-wrapper";
import { notFound } from "next/navigation";
import EditExpenseForm from "@/app/ui/expenses/edit-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";

const breadcrumbs = (id: string) => [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Expenses",
        href: "/dashboard/expenses",
    },
    {
        label: "Edit",
        href: `/dashboard/expenses/${id}`,
    },
];

const Page = async ({ params }: { params: { id: string } }) => {
    // get id from params
    const id = params.id;
    // get all categories
    const categories = await fetchCategories();
    // get expense by id
    const expense = await fetchExpenseById(id);
    // if expense is not found, return nextjs default not found page
    if (!expense) {
        return notFound();
    }

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs(id)} />
            <FormWrapper title="Expense" description="Modify the information for your expense.">
                <EditExpenseForm expense={expense} categories={categories} />
            </FormWrapper>
        </div>
    );
};

export default Page;
