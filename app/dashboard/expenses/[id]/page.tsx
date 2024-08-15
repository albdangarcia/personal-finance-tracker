import { fetchCategories, fetchExpenseById } from "@/app/lib/data";
import FormWrapper from "@/app/ui/form-wrapper";
import { notFound } from "next/navigation";
import EditExpenseForm from "@/app/ui/expenses/edit-form";

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
        <FormWrapper title="Expense" description="Edit the infomation below for Expense.">
            <EditExpenseForm expense={expense} categories={categories} />
        </FormWrapper>
    );
};

export default Page;
