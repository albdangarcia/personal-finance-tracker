import { fetchCategories } from "@/app/lib/data/categories";
import { fetchDebtById } from "@/app/lib/data/debt";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import EditDebtForm from "@/app/ui/debts/edit-form";
import FormWrapper from "@/app/ui/form-wrapper";
import { notFound } from "next/navigation";

const breadcrumbs = (id: string) => [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Debts",
        href: "/dashboard/debts",
    },
    {
        label: "Edit",
        href: `/dashboard/debts/${id}`,
    },
];


const Page = async ({ params }: { params: { id: string } }) => {
    // get id from params
    const id = params.id;
    
    // get all categories
    const categories = await fetchCategories();
    
    // get debt by id
    const debt = await fetchDebtById(id);

    // if the debt is not found, return nextjs default not found page
    if (!debt) {
        return notFound();
    }

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs(id)} />
            <FormWrapper
                title="Debt"
                description="Modify the information for your Debt."
            >
                <EditDebtForm
                    debt={debt}
                    categories={categories}
                />
            </FormWrapper>
        </div>
    );
}

export default Page;