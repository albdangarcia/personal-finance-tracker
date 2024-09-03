"use client";
import { useFormState } from "react-dom";
import { CategoryInfo } from "@/app/lib/interfaces";
import FormButtons from "../form-buttons";
import { IncomeFormErrors } from "@/app/lib/zod-schemas";
import { createIncome } from "@/app/lib/actions/income";
import { Frequency, IncomeType } from "@prisma/client";
import { capitalizeFirstLetter } from "@/app/lib/utils/general";
import { useState } from "react";

const CreateIncomeForm = ({ categories }: { categories: CategoryInfo[] }) => {
    // Error state for the form
    const initialState = { message: null, errors: {} };
    // Form state
    const [state, dispatch] = useFormState<IncomeFormErrors, FormData>(
        createIncome,
        initialState
    );
    
    // State to determine if the income is regular
    const [isRegularIncome, setIsRegularIncome] = useState<boolean>(true);

    // Handle the income type selection
    const handleIncomeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsRegularIncome(e.target.value === IncomeType.REGULAR);
    }

    return (
        <div>
            <form action={dispatch} className="grid gap-y-4">
                {/* Income type */}
                <div>
                    <label htmlFor="incomeType">Income Type</label>
                    <select
                        name="incomeType"
                        id="incomeType"
                        required
                        autoComplete="off"
                        aria-describedby="incomeType-error"
                        onChange={handleIncomeType}
                    >
                        {Object.values(IncomeType).map((type) => (
                            <option
                                key={type}
                                className="text-red-500"
                                value={type}
                            >
                                {capitalizeFirstLetter(type)}
                            </option>
                        ))}
                    </select>
                    {/* Income type errors */}
                    <div
                        id="incomeType-error"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {state.errors?.incomeType &&
                            state.errors.incomeType.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Frequency */}
                <div>
                    <label htmlFor="frequency">Frequency</label>
                    <select
                        name="frequency"
                        id="frequency"
                        autoComplete="off"
                        aria-describedby="frequency-error"
                        disabled={isRegularIncome ? false : true}
                        className="disabled:opacity-50 disabled:bg-gray-100"
                    >
                        {Object.values(Frequency).map((frequency) => (
                            <option
                                key={frequency}
                                value={frequency}
                            >
                                {capitalizeFirstLetter(frequency)}
                            </option>
                        ))}
                    </select>
                    {/* Income type errors */}
                    <div
                        id="frequency-error"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {state.errors?.frequency &&
                            state.errors.frequency.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
                    
                {/* Display the category input */}
                <div>
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

                {/* Start date input */}
                <div>
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        autoComplete="off"
                        required
                        aria-describedby="startDate-error"
                    />
                    {/* startDate errors */}
                    <div id="startDate-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.startDate &&
                            state.errors.startDate.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* End date input */}
                <div>
                    <label htmlFor="endDate">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        autoComplete="off"
                        aria-describedby="endDate-error"
                        disabled={isRegularIncome ? false : true}
                        className="disabled:opacity-50 disabled:bg-gray-100"
                    />
                    {/* endDate errors */}
                    <div id="endDate-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.endDate &&
                            state.errors.endDate.map((error: string) => (
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
                <FormButtons redirectTo="/dashboard/incomes" />
            </form>
        </div>
    );
};

export default CreateIncomeForm;
