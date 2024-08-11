"use client";
import { useFormState } from "react-dom";
import { createBudget } from "@/app/lib/actions/budget";
import { BudgetFormErrorState } from "@/app/lib/zod-schemas";
import { AvailableCategoryProps } from "@/app/lib/types";
import FormButtons from "../form-buttons";

export default function CreateBudgetForm({
  categories,
}: {
  categories: AvailableCategoryProps[];
}) {
  // Error state for the form
  const initialState = { message: null, errors: {} };
  // Form state
  const [state, dispatch] = useFormState<BudgetFormErrorState, FormData>(
    createBudget,
    initialState
  );
  return (
    <div>
      <form action={dispatch}>
        {/* Display the available categories */}
        <div>
          <label htmlFor="category">Category</label>
          <select name="category" id="category" required>
            {categories.map((category) => (
              <option
                key={category.id}
                className="capitalize"
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {/* Category errors */}
        <div id="categoryId-error" aria-live="polite" aria-atomic="true">
          {state.errors?.categoryId &&
            state.errors.categoryId.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        {/* Display the allocation input */}
        <div>
          <label htmlFor="allocation">Allocation</label>
          <input
            type="number"
            name="allocation"
            id="allocation"
            aria-describedby="allocation-error"
            required
            className="border"
          />
        </div>
        {/* Input errors */}
        <div id="allocation-error" aria-live="polite" aria-atomic="true">
          {state.errors?.allocation &&
            state.errors.allocation.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        {/* General errors */}
        <div id="budget-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500" key={state.message}>
              {state.message}
            </p>
          )}
        </div>
        {/* Form buttons */}
        <FormButtons redirectTo="/dashboard/budgets" />
      </form>
    </div>
  );
}