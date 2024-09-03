"use client";
import { useFormState } from "react-dom";
import { updateContribution } from "@/app/lib/actions/contribution";
import { ContributionFormError } from "@/app/lib/zod-schemas";
import FormButtons from "../form-buttons";
import { ContributionById } from "@/app/lib/interfaces";


interface Props {
    contribution: ContributionById;
}

const EditContributionForm = ({ contribution }: Props) => {
    const updateContributionWithId = updateContribution.bind(null, contribution.id, contribution.savingsGoal.id);
    // Error state for the form
    const initialState = { message: null, errors: {} };
    // Form state
    const [state, dispatch] = useFormState<ContributionFormError, FormData>(
        updateContributionWithId,
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
                            defaultValue={contribution.amount}
                            aria-describedby="amount-error"
                            required
                            step="0.01"
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
                        defaultValue={contribution.date.toISOString().split("T")[0]}
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
                <FormButtons redirectTo={`/dashboard/savings-goals/${contribution.savingsGoal.id}/contributions`} />
            </form>
        </div>
    );
};

export default EditContributionForm;
