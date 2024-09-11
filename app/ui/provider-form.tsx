"use client";
import { useFormState } from "react-dom";
import { providerLogin } from "../lib/actions/login";
import { ProviderFormErrors } from "../lib/zod-schemas";
import { Provider } from "../lib/interfaces";

const LoginProviderForm = ({ providers }: { providers: Provider[] }) => {
    // Error initial state
    const errorsInitialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState<
        ProviderFormErrors | undefined,
        FormData
    >(providerLogin, errorsInitialState);

    return (
        <>
            {/* divider */}
            <div className="flex items-center mt-3 mb-5">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-gray-500">or</span>
                <hr className="flex-grow border-t border-gray-300" />
            </div>
            <div className="grid gap-y-3">
                {Object.values(providers).map((provider) => (
                    <form action={dispatch} key={provider.id}>
                        <input
                            type="hidden"
                            name="providerId"
                            value={provider.id}
                        />
                        <button
                            type="submit"
                            className="flex items-center justify-center px-5 py-2 w-full border border-gray-300 rounded hover:bg-gray-100"
                        >
                            <img
                                loading="lazy"
                                width={24}
                                height={24}
                                src={`https://authjs.dev/img/providers/${provider.id}.svg`}
                                alt={provider.id}
                            />
                            <span className="flex-1 text-center text-sm">
                                Sign in with {provider.name}
                            </span>
                        </button>
                    </form>
                ))}

                {/* Provider errors */}
                <div id="provider-error" aria-live="polite" aria-atomic="true">
                    {state &&
                        state.errors?.providerId &&
                        state.errors.providerId.map((error: string) => (
                            <p
                                className="mt-2 text-sm text-red-600"
                                key={error}
                            >
                                {error}
                            </p>
                        ))}
                    {state && state.message && (
                        <p
                            className="mt-2 text-sm text-red-600"
                            key={state.message}
                        >
                            {state.message}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default LoginProviderForm;
