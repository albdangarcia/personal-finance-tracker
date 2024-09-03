"use client";
import { useFormState } from "react-dom";
import { CategoryInfo, DebtById } from "@/app/lib/interfaces";
import FormButtons from "../form-buttons";
import { DebtFormError } from "@/app/lib/zod-schemas";
import { updateDebt } from "@/app/lib/actions/debt";

interface Props {
    categories: CategoryInfo[];
    debt: DebtById;
}

const EditDebtForm = ({ categories, debt }: Props) => {
    const updateDebtWithId = updateDebt.bind(null, debt.id);
    // Error state for the form
    const initialState = { message: null, errors: {} };
    // Form state
    const [state, dispatch] = useFormState<DebtFormError, FormData>(
        updateDebtWithId,
        initialState
    );
    return (
        <div>
            <form action={dispatch} className="grid gap-y-4">
                <div>
                    {/* Display all categories */}
                    <label htmlFor="categoryId">Category</label>
                    <select
                        name="categoryId"
                        id="categoryId"
                        required
                        autoComplete="off"
                        defaultValue={debt.categoryId}
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

                {/* Debt name */}
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="off"
                        required
                        placeholder="Enter debt name"
                        defaultValue={debt.name}
                        aria-describedby="name-error"
                    />
                    {/* Input name errors */}
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

                {/* Display amount input */}
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
                            defaultValue={debt.amount}
                            required
                            step="0.01"
                            className="pl-6"
                        />
                    </div>
                    {/* Input amount errors */}
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

                {/* Interest Input */}
                <div>
                    <label htmlFor="interest">Interest Rate</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm sm:leading-5">
                                %
                            </span>
                        </div>
                        <input
                            type="number"
                            name="interest"
                            id="interest"
                            autoComplete="off"
                            placeholder="0"
                            aria-describedby="interest-error"
                            defaultValue={debt.interest}
                            required
                            step="0.01"
                            className="pl-6"
                        />
                    </div>
                    {/* Input interest errors */}
                    <div
                        id="interest-error"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {state.errors?.interest &&
                            state.errors.interest.map((error: string) => (
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
                <div
                    id="savings-goal-error"
                    aria-live="polite"
                    aria-atomic="true"
                >
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
                <FormButtons redirectTo="/dashboard/debts" />
            </form>
        </div>
    );
};

export default EditDebtForm;
