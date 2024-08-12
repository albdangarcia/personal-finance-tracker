"use client";
import { AvailableCategoryProps } from "@/app/lib/types";
import { updateBudget } from "@/app/lib/actions/budget";
import { BudgetFormErrorState } from "@/app/lib/zod-schemas";
import { useFormState } from "react-dom";
import FormButtons from "@/app/ui/form-buttons";

type BudgetProps = {
  category: {
    id: string;
    name: string;
  };
  id: string;
  amount: number;
};
export default function EditBudgetForm({
  budget,
  categories,
}: {
  budget: BudgetProps;
  categories: AvailableCategoryProps[];
}) {
  const updateBudgetWithId = updateBudget.bind(null, budget.id);
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState<BudgetFormErrorState, FormData>(
    updateBudgetWithId,
    initialState
  );
  return (
    <div>
      <form action={dispatch} className="grid gap-y-3">
        <div>
          {/* Display the available categories */}
          <label htmlFor="categoryId">Category</label>
          <select
            name="categoryId"
            id="categoryId"
            required
            autoComplete="off"
            aria-describedby="categoryId-error"
            defaultValue={budget.category.id}
          >
            {categories.map((category) => (
              <option
                key={category.id}
                className="capitalize"
                value={category.id}
              >
                {category.name}
              </option>
            ))}
            <option
              key={budget.category.id}
              className="capitalize"
              value={budget.category.id}
            >
              {budget.category.name}
            </option>
          </select>
          {/* Category errors */}
          <div id="categoryId-error" aria-live="polite" aria-atomic="true">
            {state.errors?.categoryId &&
              state.errors.categoryId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Display the amount input */}
        <div>
          <label htmlFor="amount">Amount</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              autoComplete="off"
              placeholder="0.00"
              aria-describedby="amount-error"
              required
              defaultValue={budget.amount}
              className="pl-6"
            />
          </div>
          {/* Input errors */}
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div id="budget-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500" key={state.message}>
              {state.message}
            </p>
          )}
        </div>
        <FormButtons redirectTo="/dashboard/budgets" />
      </form>
    </div>
  );
}
