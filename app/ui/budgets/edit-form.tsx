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
  allocation: number;
};
export default function Page({
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
      <form action={dispatch}>
        <div>
          <label htmlFor="category">Category</label>
          <select name="category" id="category" required defaultValue={budget.category.id}>
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
              value={budget.category.id}
            >
              {budget.category.name}
            </option>
          </select>
        </div>
        <div>
          <label htmlFor="allocation">Allocation</label>
          <input
            type="number"
            name="allocation"
            id="allocation"
            required
            className="border"
            defaultValue={budget.allocation}
          />
        </div>
        <FormButtons redirectTo="/dashboard/budgets"/>
      </form>
    </div>
  );
}
