"use server";
import { signIn } from "@/auth";
import { LoginFormErrors, SignInSchema } from "../zod-schemas";
import { AuthError } from "next-auth";

/**
 * Authenticates the login process by validating form data and attempting to sign in the user.
 *
 * @param {LoginFormErrors | undefined} prevState - The previous state of login form errors.
 * @param {FormData} formData - The form data containing email and password fields.
 * @returns {Promise<{ errors?: Record<string, string[]>, message: string }>} - A promise that resolves to an object containing errors and a message if validation fails, or just a message if authentication fails.
 * @throws {AuthError} - Throws an AuthError if an unexpected authentication error occurs.
 */
const authenticateLogin = async (
    prevState: LoginFormErrors | undefined,
    formData: FormData
) => {
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
    const formDataValidated: Record<string, string> = { email: email, password: password };

    // Attempt to authenticate the user
    try {
        // Sign in with credentials then redirect to dashboard if successful
        await signIn("credentials", {
            redirectTo: "/dashboard",
            ...formDataValidated,
        });
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

export { authenticateLogin };
