"use server";
import { signIn } from "@/auth";
import { LoginFormErrors, ProviderFormErrors, ProviderLoginSchema, SignInSchema } from "../zod-schemas";
import { AuthError } from "next-auth";

/**
 * Authenticates the login process by validating form data and attempting to sign in the user.
 *
 * @param {LoginFormErrors | undefined} prevState - The previous state of login form errors.
 * @param {FormData} formData - The form data containing email and password fields.
 * @returns {Promise<LoginFormErrors>} - A promise that resolves to an object containing errors and a message if validation fails, or just a message if authentication fails.
 * @throws {AuthError} - Throws an AuthError if an unexpected authentication error occurs.
 */
const authenticateLogin = async (
    prevState: LoginFormErrors,
    formData: FormData
): Promise<LoginFormErrors> => {
    // Validate form fields using Zod
    const validatedFields = SignInSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Sign In.",
        };
    }

    // Extract validated fields
    const { email, password } = validatedFields.data;

    // Create a new object with the validated form data
    const formDataValidated: Record<string, string> = {
        email: email,
        password: password,
    };

    // Attempt to authenticate the user
    try {
        // Sign in with credentials then redirect to dashboard if successful
        await signIn("credentials", {
            redirectTo: "/dashboard",
            ...formDataValidated,
        });

        // Return a success message if sign-in is successful
        return { message: "Sign-in successful" };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { message: "Invalid credentials" };
                case "CredentialsSignin":
                    throw error;
                default:
                    return { message: "Something went wrong" };
            }
        }
        throw error;
    }
};

/**
 * Logs in a provider using the provided form data.
 *
 * @param {ProviderFormErrors | undefined} prevState - The previous state of the form errors.
 * @param {FormData} formData - The form data containing the provider's login information.
 * @returns {Promise<ProviderFormErrors | undefined>} - A promise that resolves to an object containing errors or a message, or undefined if successful.
 */
const providerLogin = async (
    prevState: ProviderFormErrors | undefined,
    formData: FormData
): Promise<ProviderFormErrors | undefined> => {

    // Validate form fields using Zod
    const validatedFields = ProviderLoginSchema.safeParse({
        providerId: formData.get("providerId"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // Extract validated fields
    const { providerId } = validatedFields.data;

    try {
        // Sign in with the provider then redirect to dashboard if successful
        await signIn(providerId, {
            redirectTo: "/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return { message: "Something went wrong" };
        }
        throw error;
    }
};

export { authenticateLogin, providerLogin };
