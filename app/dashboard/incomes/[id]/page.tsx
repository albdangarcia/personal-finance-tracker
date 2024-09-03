import { fetchCategories } from "@/app/lib/data/categories";
import FormWrapper from "@/app/ui/form-wrapper";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import EditIncomeForm from "@/app/ui/incomes/edit-form";
import { fetchIncomeById } from "@/app/lib/data/income";

const breadcrumbs = (id: string) => [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Incomes",
        href: "/dashboard/incomes",
    },
    {
        label: "Edit",
        href: `/dashboard/incomes/${id}`,
    },
];

const Page = async ({ params }: { params: { id: string } }) => {
    // get id from params
    const id = params.id;
    
    // get all categories
    const categories = await fetchCategories();
    
    // get income by id
    const income = await fetchIncomeById(id);

    // if income is not found, return nextjs default not found page
    if (!income) {
        return notFound();
    }

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs(id)} />
            <FormWrapper title="Income" description="Modify the information for your income.">
                <EditIncomeForm income={income} categories={categories} />
            </FormWrapper>
        </div>
    );
}

export default Page;