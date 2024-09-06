"use client";
import { useFormState } from "react-dom";
import { LoginFormErrors } from "../lib/zod-schemas";
import { authenticateLogin } from "../lib/actions/login";

const LoginForm = () => {
    // Error initial state
    const errorsInitialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState<
        LoginFormErrors | undefined,
        FormData
    >(authenticateLogin, errorsInitialState);

    return (
        <form action={dispatch} className="grid gap-y-4">
            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    aria-describedby="email-error"
                    autoComplete="email"
                />
                {/* email input errors */}
                <div id="email-error" aria-live="polite" aria-atomic="true">
                    {state &&
                        state.errors?.email &&
                        state.errors.email.map((error: string) => (
                            <p
                                className="mt-2 text-sm text-red-600"
                                key={error}
                            >
                                {error}
                            </p>
                        ))}
                </div>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    aria-describedby="password-error"
                    placeholder="Enter your password"
                />
                {/* Password input errors */}
                <div id="password-error" aria-live="polite" aria-atomic="true">
                    {state &&
                        state.errors?.password &&
                        state.errors.password.map((error: string) => (
                            <p
                                className="mt-2 text-sm text-red-600"
                                key={error}
                            >
                                {error}
                            </p>
                        ))}
                </div>
            </div>

            {/* General input errors */}
            <div id="login-error" aria-live="polite" aria-atomic="true">
                {state && state.message && (
                    <p
                        className="mt-2 text-sm text-red-600"
                        key={state.message}
                    >
                        {state.message}
                    </p>
                )}
            </div>

            {/* Submit button */}
            <button
                type="submit"
                className="bg-black text-white py-2 rounded-md"
            >
                Log in
            </button>
        </form>
    );
};

export default LoginForm;
