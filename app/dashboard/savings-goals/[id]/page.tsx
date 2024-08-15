import { fetchCategories, fetchSavingsGoalById } from "@/app/lib/data";
import FormWrapper from "@/app/ui/form-wrapper";
import { notFound } from "next/navigation";
import EditSavingsGoalForm from "@/app/ui/savings-goals/edit-form";

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
        <FormWrapper title="Savings" description="Edit the infomation below for Savings Goal.">
            <EditSavingsGoalForm savingsGoal={savingsGoal} categories={categories} />
        </FormWrapper>
    );
};

export default Page;
