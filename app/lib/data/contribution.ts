import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";

type ContributionsGoal = {
    id: string;
    name: string;
    amount: number;
    category: {
        name: string;
    };
    contributions: {
        id: string;
        amount: number;
        date: Date;
    }[];
}

/**
 * Fetches contributions for a specific savings goal by its ID.
 * 
 * @param {string} id - The ID of the savings goal to fetch contributions for.
 * @returns {Promise<ContributionsGoal | null>} - A promise that resolves to the savings goal object with its contributions, or null if not found.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
const fetchContributionsBySavingsGoalId = async (id: string): Promise<ContributionsGoal | null> => {
    // Disable caching for this function
    noStore();

    // Fetch contributions for the savings goal from the database using Prisma
    try {
        const savingsGoal = await prisma.savingsGoal.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                amount: true,
                contributions: {
                    select: {
                        id: true,
                        amount: true,
                        date: true,
                    },
                    orderBy: {
                        date: "desc",
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return savingsGoal;
    } catch (error) {
        console.error("Failed to fetch contributions:", error);
        throw new Error("Failed to fetch contributions.");
    }
}

type ContributionType = {
    savingsGoal: {
        id: string;
        name: string;
    };
    id: string;
    amount: number;
    date: Date;
}

/**
 * Fetches a contribution by its ID from the database.
 * 
 * @param {string} id - The ID of the contribution to fetch.
 * @returns {Promise<ContributionType | null>} - A promise that resolves to the contribution object if found, otherwise null.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
const fetchContributionById = async (id: string): Promise<ContributionType | null> => {
    // Disable caching for this function
    noStore();
    
    // Fetch the contribution by ID from the database using Prisma
    try {
        const contribution = await prisma.contribution.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                amount: true,
                date: true,
                savingsGoal: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return contribution;
    } catch (error) {
        console.error("Failed to fetch contribution:", error);
        throw new Error("Failed to fetch contribution.");
    }
}

export { fetchContributionsBySavingsGoalId, fetchContributionById };