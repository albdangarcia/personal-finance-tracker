"use client";
import { useFormState } from "react-dom";
import { createContribution } from "@/app/lib/actions/contribution";
import { ContributionFormErrorState } from "@/app/lib/zod-schemas";
import FormButtons from "../form-buttons";

const CreateContributionForm = ({ goalId }: { goalId: string }) => {
    const createContributionWithId = createContribution.bind(null, goalId);
    // Error state for the form
    const initialState = { message: null, errors: {} };
    // Form state
    const [state, dispatch] = useFormState<ContributionFormErrorState, FormData>(
        createContributionWithId,
        initialState
    );
    return (
        <div>
            <form action={dispatch} className="grid gap-y-4">
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
                {/* Date input */}
                <div>
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        autoComplete="off"
                        required
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
                <FormButtons redirectTo={`/dashboard/savings-goals/${goalId}/contributions`} />
            </form>
        </div>
    );
};

export default CreateContributionForm;
