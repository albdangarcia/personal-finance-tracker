/**
 * WARNING: Password-based Authentication Risks
 *
 * Using custom password-based authentication instead of OAuth providers
 * comes with significant risks and challenges, including:
 *
 * 1. Lack of sophisticated abuse detection (bot-protection, rate-limiting)
 * 2. Complex password management (reset, credential stuffing, rotation)
 * 3. Data security concerns (encryption, salting, strength validation)
 *
 * OAuth providers invest heavily in these areas. Consider leveraging their
 * battle-tested solutions instead of rebuilding from scratch.
 *
 * This open-source project uses password-based authentication for easier
 * setup and usage without requiring accounts with external providers.
 * In the auth.config.ts file, there's an option to add providers.
 * Please be mindful of the risks and ensure you address these concerns
 * when using or extending this authentication system.
 *
 */

"use server";
import { SignupFormErrors, SignupSchema } from "../zod-schemas";
import prisma from "../prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

/**
 * Handles user sign-up by validating form data, checking for existing users, hashing the password, and creating a new user in the database.
 *
 * @param {SignupFormErrors} prevState - The previous state of sign-up form errors.
 * @param {FormData} formData - The form data containing name, email, and password fields.
 * @returns {Promise<SignupFormErrors>} - A promise that resolves to an object containing errors and a message if validation fails, or just a message if user creation fails or succeeds.
 */
const signupUser = async (
    prevState: SignupFormErrors,
    formData: FormData
): Promise<SignupFormErrors> => {
    // Validate form fields using Zod
    const validatedFields = SignupSchema.safeParse({
        name: formData.get("name"),
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
    const { name, email, password } = validatedFields.data;

    // Check if the email already exists in the database
    const existingUser = await prisma.user.findUnique({
        where: { email: email },
    });

    // If the user already exists, return an message
    if (existingUser) {
        return {
            message: "Email already exists. Please use a different email.",
        };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Attempt to create a new user
    try {
        await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });
    } catch (error) {
        console.error("Failed to Create User:", error);
        return {
            message: "Database Error: Failed to Create User.",
        };
    }

    // Redirect the user
    redirect("/login");
};

export { signupUser };
