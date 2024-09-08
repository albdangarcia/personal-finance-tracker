"use client";
import { useFormState } from "react-dom";
import { LoginFormErrors } from "../lib/zod-schemas";
import { authenticateLogin } from "../lib/actions/login";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const LoginForm = () => {
    // Error initial state
    const errorsInitialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState<
        LoginFormErrors,
        FormData
    >(authenticateLogin, errorsInitialState);

    // State for password visibility
    const [passwordVisible, setPasswordVisible] = useState(false);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    
    return (
        <form action={dispatch} className="grid gap-y-5">
            {/* Email input */}
            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    aria-describedby="email-error"
                    autoComplete="email"
                    required
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

            {/* Password input */}
            <div>
                <label htmlFor="password">Password</label>
                <div className="relative">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        aria-describedby="password-error"
                        placeholder="Enter your password"
                        required
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 px-3 py-2 text-gray-700"
                    >
                        {passwordVisible ? (
                            <EyeIcon className="h-5 w-5" />
                        ) : (
                            <EyeSlashIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
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
