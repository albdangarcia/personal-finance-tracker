import { fetchAvailableCategories } from "@/app/lib/data";
import CreateBudgetForm from "@/app/ui/budgets/create-form";

// Page for creating a budget
export default async function Page() {
  // Fetch categories from the database
  const categories = await fetchAvailableCategories();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-5">Create Budget</h1>
      {/* Pass categories to the Form component */}
      <CreateBudgetForm categories={categories} />
    </div>
  );
}