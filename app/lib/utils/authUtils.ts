import { auth } from "@/auth";

const getAuthenticatedUserId = async (): Promise<string> => {
    // Get the user session
    const session = await auth();

    // If the user is not authenticated, throw an error
    if (!session || !session.user) {
        throw new Error("Not authenticated");
    }

    // Extract and return the user ID from the session
    return session.user.id as string;
}

export { getAuthenticatedUserId };