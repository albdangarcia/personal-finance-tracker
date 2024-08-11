import { fetchAvailableCategories, fetchBudgetById } from "@/app/lib/data";
import EditForm from "@/app/ui/budgets/edit-form";
import { notFound } from "next/navigation";

// Page for editing a budget
export default async function Page({ params }: { params: { id: string } }) {
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
    <div>
      <h1 className="text-2xl font-semibold mb-5">Edit Budget</h1>
      {/* pass budget and categories to EditForm component */}
      <EditForm budget={budget} categories={categories} />
    </div>
  );
}
