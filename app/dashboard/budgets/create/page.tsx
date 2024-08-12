import { fetchAvailableCategories } from "@/app/lib/data";
import CreateBudgetForm from "@/app/ui/budgets/create-form";
import FormWrapper from "@/app/ui/budgets/form-wrapper";

// Page for creating a budget
export default async function Page() {
  // Fetch categories from the database
  const categories = await fetchAvailableCategories();

  return (
    <FormWrapper formTitle="Create Budget">
      {/* Pass categories to the Form component */}
      <CreateBudgetForm categories={categories} />
    </FormWrapper>
  );
}
