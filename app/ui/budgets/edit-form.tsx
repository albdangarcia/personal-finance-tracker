"use client";
import { CategoryInfo } from "@/app/lib/interfaces";
import { updateBudget } from "@/app/lib/actions/budget";
import { BudgetFormError } from "@/app/lib/zod-schemas";
import { useFormState } from "react-dom";
import FormButtons from "@/app/ui/form-buttons";
import { BudgetById } from "@/app/lib/interfaces";

type editBudgetFormProps = {
    budget: BudgetById,
    categories: CategoryInfo[];
};

const EditBudgetForm = ({ budget, categories }: editBudgetFormProps) => {
    const updateBudgetWithId = updateBudget.bind(null, budget.id);
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState<BudgetFormError, FormData>(
        updateBudgetWithId,
        initialState
    );
    return (
        <div>
            <form action={dispatch} className="grid gap-y-4">
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
                    </select>
                    {/* Category errors */}
                    <div
                        id="categoryId-error"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {state.errors?.categoryId &&
                            state.errors.categoryId.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}
                                >
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
                            <span className="text-gray-500 sm:text-sm sm:leading-5">
                                $
                            </span>
                        </div>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            autoComplete="off"
                            placeholder="0.00"
                            aria-describedby="amount-error"
                            required
                            step="0.01"
                            defaultValue={budget.amount}
                            className="pl-6"
                        />
                    </div>
                    {/* Amount errors */}
                    <div
                        id="amount-error"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {state.errors?.amount &&
                            state.errors.amount.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="yearMonth">Month Year</label>
                    <input
                        type="month"
                        name="yearMonth"
                        id="yearMonth"
                        autoComplete="off"
                        aria-describedby="yearMonth-error"
                        required
                        defaultValue={budget.yearMonth}
                    />
                    {/* Month Year errors */}
                    <div
                        id="yearMonth-error"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {state.errors?.yearMonth &&
                            state.errors.yearMonth.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Display general error message */}
                <div id="budget-error" aria-live="polite" aria-atomic="true">
                    {state.message && (
                        <p
                            className="mt-2 text-sm text-red-500"
                            key={state.message}
                        >
                            {state.message}
                        </p>
                    )}
                </div>
                <FormButtons redirectTo="/dashboard/budgets" />
            </form>
        </div>
    );
};

export default EditBudgetForm;
