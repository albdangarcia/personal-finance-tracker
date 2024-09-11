import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./app/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { authProviderConfigList } from "./auth.config";
import { SignInSchema } from "./app/lib/zod-schemas";
import { Provider } from "next-auth/providers";

// Get user from db
async function getUser(email: string): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        return user;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}

// Credentials setup for admin email/password login
const credentialsProviderConfig = Credentials({
    // The credentials object is used to define the fields used to log in
    credentials: {
        email: {
            label: "Email",
            type: "email",
        },
        password: {
            label: "Password",
            type: "password",
        },
    },
    // The authorize callback validates credentials
    authorize: async (credentials) => {
        // Validate the credentials for the user
        const parsedCredentials = SignInSchema.safeParse(credentials);

        // If the credentials are valid, return the user object
        if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;

            // Fetch the user from the database
            const user = await getUser(email);

            // If user does not exist or password is missing, return null
            if (!user || !user.password) return null;

            const passwordsMatch = await bcrypt.compare(
                password,
                user.password
            );

            // If the password is correct, return the user object
            if (passwordsMatch) return user;
        }
        return null;
    },
});

const providers: Provider[] = [
    credentialsProviderConfig,
    ...authProviderConfigList.providers,
];

export const providerMap = providers
    .map((provider) => {
        if (typeof provider === "function") {
            const providerData = provider();
            return { id: providerData.id, name: providerData.name };
        } else {
            return { id: provider.id, name: provider.name };
        }
    })
    .filter((provider) => provider.id !== "credentials");

// Auth configuation
export const authConfig = {
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async jwt({ token }) {
            return token;
        },
        async session({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        // Note: This needs more work possible solutions if the user is signing in with
        //       a provider and email already exists.
        // 1. Automatically link the accounts
        // 2. Throw an error and let the user know that the email already exists
        // 3. Only allow the admin to log in with credentials and the rest with providers
        // async signIn({ user, account }) {
        //     // if the user is signing in with a provider, check if the email already exists
        //     if (account && user.email) {
        //         if (account.provider !== "credentials") {
        //             // Check if a user with this email already exists
        //             const existingUser = await getUser(user.email);
        //             if (existingUser) {
        //                 throw new Error("Email already exists.");
        //             }
        //         }
        //     }
        //     return true; // Allow sign-in
        // },
    },
    session: {
        strategy: "jwt",
    },
    providers: providers,
    pages: {
        signIn: "/login",
    },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
