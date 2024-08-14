import { fetchCategories } from "@/app/lib/data";
import CreateExpenseForm from "@/app/ui/expenses/create-form";
import FormWrapper from "@/app/ui/form-wrapper";

// Page for creating a expense
const Page = async () => {
  // Fetch all categories from the database
  const categories = await fetchCategories();

  return (
    <FormWrapper formTitle="Create Expense">
      {/* Pass categories to the Form component */}
      <CreateExpenseForm categories={categories} />
    </FormWrapper>
  );
}

export default Page;