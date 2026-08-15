import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./app/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { UserModel } from "@/prisma/generated/models/User";
import bcrypt from "bcrypt";
import { authProviderConfigList } from "./auth.config";
import { SignInSchema } from "./app/lib/zod-schemas";
import { Provider } from "next-auth/providers";

// Get user from db
async function getUser(email: string): Promise<UserModel | null> {
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
        // Handles cases where a user tries to sign in with an OAuth provider
        // using an email that already exists in the system.
        async signIn({ user, account }) {
            // Allow sign in for the credentials (email/password) provider
            if (account?.provider === "credentials") {
                return true;
            }

            // For OAuth providers (Google, GitHub, etc.)
            if (user.email) {
                // Check if a user with this email already exists
                const existingUser = await getUser(user.email);

                // If a user with this email exists, prevent linking a new OAuth account
                // to avoid potential account takeovers.
                if (existingUser) {
                    // throw a specific error. The `pages.error` config
                    // will catch this and redirect the user appropriately.
                    throw new Error("EmailExists");
                }
            }

            // Allow sign-in for new users
            return true;
        },
    },
    session: {
        strategy: "jwt",
    },
    providers: providers,
    pages: {
        signIn: "/login",
        error: "/login"
    },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
