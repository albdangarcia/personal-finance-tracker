import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./app/lib/prisma";
import { z } from "zod";
import Credentials from "next-auth/providers/credentials";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { authProviderConfigList } from "./auth.config";

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
        const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

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
    },
    session: {
        strategy: "jwt",
    },
    providers: [credentialsProviderConfig, ...authProviderConfigList.providers],
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
