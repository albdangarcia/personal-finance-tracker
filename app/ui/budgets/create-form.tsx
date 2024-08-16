"use client";
import { useFormState } from "react-dom";
import { createBudget } from "@/app/lib/actions/budget";
import { BudgetFormErrorState } from "@/app/lib/zod-schemas";
import { CategoryProps } from "@/app/lib/types";
import FormButtons from "../form-buttons";

const CreateBudgetForm = ({ categories }: { categories: CategoryProps[] }) => {
    // Error state for the form
    const initialState = { message: null, errors: {} };
    // Form state
    const [state, dispatch] = useFormState<BudgetFormErrorState, FormData>(
        createBudget,
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
                            className="pl-6"
                        />
                    </div>
                    {/* Input errors */}
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
                {/* General errors */}
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
                {/* Form buttons */}
                <FormButtons redirectTo="/dashboard/budgets" />
            </form>
        </div>
    );
};

export default CreateBudgetForm;
