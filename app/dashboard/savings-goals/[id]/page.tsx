import { fetchSavingsGoalById } from "@/app/lib/data/savings-goal";
import { fetchCategories } from "@/app/lib/data/categories";
import FormWrapper from "@/app/ui/form-wrapper";
import { notFound } from "next/navigation";
import EditSavingsGoalForm from "@/app/ui/savings-goals/edit-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";

const breadcrumbs = (id: string) => [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Savings Goals",
        href: "/dashboard/savings-goals",
    },
    {
        label: "Edit",
        href: `/dashboard/savings-goals/${id}`,
    },
];

const Page = async ({ params }: { params: { id: string } }) => {
    // get id from params
    const id = params.id;
    // get all categories
    const categories = await fetchCategories();
    // get savings goal by id
    const savingsGoal = await fetchSavingsGoalById(id);
    // if the savings goal is not found, return nextjs default not found page
    if (!savingsGoal) {
        return notFound();
    }

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs(id)} />
            <FormWrapper
                title="Savings Goal"
                description="Modify the information for your Savings Goal."
            >
                <EditSavingsGoalForm
                    savingsGoal={savingsGoal}
                    categories={categories}
                />
            </FormWrapper>
        </div>
    );
};

export default Page;
