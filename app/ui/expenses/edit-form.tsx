"use client";
import { useFormState } from "react-dom";
import { updateExpense } from "@/app/lib/actions/expense";
import { ExpenseFormErrorState } from "@/app/lib/zod-schemas";
import { CategoryProps } from "@/app/lib/types";
import FormButtons from "../form-buttons";

type EditFormProps = {
    categories: CategoryProps[];
    expense: {
        name: string;
        amount: number;
        date: Date;
        id: string;
        category: CategoryProps;
    };
};

const EditExpenseForm = ({ categories, expense }: EditFormProps) => {
    const updateExpenseWithId = updateExpense.bind(null, expense.id);
    // Error state for the form
    const initialState = { message: null, errors: {} };
    // Form state
    const [state, dispatch] = useFormState<ExpenseFormErrorState, FormData>(
        updateExpenseWithId,
        initialState
    );
    return (
        <div>
            <form action={dispatch} className="grid gap-y-3">
                <div>
                    {/* Display the all categories */}
                    <label htmlFor="categoryId">Category</label>
                    <select
                        name="categoryId"
                        id="categoryId"
                        required
                        autoComplete="off"
                        defaultValue={expense.category.id}
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
                {/* Expense name */}
                <div>
                    <label htmlFor="name">Expense name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="off"
                        required
                        placeholder="Enter expense name"
                        defaultValue={expense.name}
                        aria-describedby="name-error"
                    />
                    {/* Name errors */}
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map((error: string) => (
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
                            defaultValue={expense.amount}
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
                {/* Date input */}
                <div className="date-input-container">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        autoComplete="off"
                        required
                        defaultValue={expense.date.toISOString().split("T")[0]}
                        aria-describedby="date-error"
                    />
                    {/* Date errors */}
                    <div id="date-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.date &&
                            state.errors.date.map((error: string) => (
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
                <div id="expense-error" aria-live="polite" aria-atomic="true">
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
                <FormButtons redirectTo="/dashboard/expenses" />
            </form>
        </div>
    );
};

export default EditExpenseForm;
