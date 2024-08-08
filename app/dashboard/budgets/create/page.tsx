"use client";
import { useFormState } from "react-dom";
import { createBudget } from "@/app/actions/budget";
import { BudgetFormErrorState } from "@/app/lib/zod-schemas";

export default function Page() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState<BudgetFormErrorState, FormData>(createBudget, initialState);

  return (
    <div>
      <form action={dispatch}>
        <div>
          <label htmlFor="frequency">Frequency</label>
          <select name="frequency" id="frequency" required>
            <option value="MONTHLY" defaultValue="true">MONTHLY</option>
            <option value="WEEKLY">WEEKLY</option>
          </select>
        </div>
        <div>
          <label htmlFor="allocation">Allocation</label>
          <input type="number" name="allocation" id="allocation" required  className="border"/>
        </div>
        <button className='bg-indigo-700 text-white p-2' type="submit">Create Budget</button>
      </form>
    </div>
  );
}