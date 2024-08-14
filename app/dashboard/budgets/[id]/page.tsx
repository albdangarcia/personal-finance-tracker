import { fetchAvailableCategories, fetchBudgetById } from "@/app/lib/data";
import EditBudgetForm from "@/app/ui/budgets/edit-form";
import { notFound } from "next/navigation";
import FormWrapper from "@/app/ui/form-wrapper";

// Page for editing a budget
const Page = async ({ params }: { params: { id: string } }) => {
  // get id from params
  const id = params.id;
  // get all available categories
  const categories = await fetchAvailableCategories();
  // get budget by id
  const budget = await fetchBudgetById(id);
  // if budget is not found, return nextjs default not found page
  if (!budget) {
    return notFound();
  }

  return (
    <FormWrapper formTitle="Edit Budget">
      <EditBudgetForm budget={budget} categories={categories} />
    </FormWrapper>
  );
};

export default Page;