import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import {
    CategoriesWithGoals,
    DataByCategories,
    SavingsGoalById,
} from "../interfaces";
import { getAuthenticatedUserId } from "../utils/authUtils";
import { IdSchema, QuerySchema } from "../zod-schemas";

// Define the number of savings goals per page
const SAVINGS_GOALS_PER_PAGE = 10;

/**
 * Fetches filtered savings goals for the authenticated user based on a query and paginates the results.
 *
 * @param {string} query - The search query to filter savings goals by name.
 * @param {number} currentPage - The current page number for pagination.
 * @returns {Promise<CategoriesWithGoals[]>} - A promise that resolves to an array of categories with savings goals.
 * @throws {Error} - Throws an error if the query parameter is invalid or if fetching savings goals fails.
 */
const fetchFilteredSavingGoals = async (
    query: string,
    currentPage: number
): Promise<CategoriesWithGoals[]> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching for this function
    noStore();

    // Validate the query parameter using Zod
    const validatedQuery = QuerySchema.safeParse(query);
    if (!validatedQuery.success) {
        console.error("Invalid query parameter:", validatedQuery.error);
        throw new Error("Invalid query parameter.");
    }

    // Calculate the offset based on the current page
    const offset = (currentPage - 1) * SAVINGS_GOALS_PER_PAGE;

    // Fetch saving goals based on the query and pagination
    // - Skip a certain number of records based on the offset for pagination.
    // - Limit the number of records returned to the value of SAVINGS_GOALS_PER_PAGE.
    try {
        const categoriesWithGoals = await prisma.category.findMany({
            where: {
                savingsGoals: {
                    some: {
                        name: {
                            contains: validatedQuery.data,
                            mode: "insensitive",
                        },
                        userId: userId, // Filter by authenticated user's ID
                    },
                },
            },
            select: {
                id: true,
                name: true,
                savingsGoals: {
                    select: {
                        id: true,
                        name: true,
                        amount: true,
                        contributions: {
                            select: {
                                amount: true,
                            },
                        },
                    },
                },
            },
            skip: offset,
            take: SAVINGS_GOALS_PER_PAGE,
        });

        // Calculate total contributions for each savings goal
        const categoriesWithTotalContributions = categoriesWithGoals.map(
            (category) => {
                const updatedSavingsGoals = category.savingsGoals.map(
                    (goal) => {
                        const totalContributions = goal.contributions.reduce(
                            (sum, contribution) => sum + contribution.amount,
                            0
                        );
                        return {
                            ...goal,
                            totalContributions,
                        };
                    }
                );
                return {
                    ...category,
                    savingsGoals: updatedSavingsGoals,
                };
            }
        );

        return categoriesWithTotalContributions;
    } catch (error) {
        console.error("Failed to fetch saving goals:", error);
        throw new Error("Failed to fetch saving goals.");
    }
};

/**
 * Fetches a savings goal by its ID for the authenticated user.
 * @param {string} id - The ID of the savings goal to fetch.
 * @returns {Promise<SavingsGoalById | null>} - A promise that resolves to the savings goal object or null if not found.
 * @throws {Error} - Throws an error if the ID parameter is invalid or if fetching the savings goal fails.
 */
const fetchSavingsGoalById = async (
    id: string
): Promise<SavingsGoalById | null> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate the ID parameter using Zod
    const validatedId = IdSchema.safeParse(id);
    if (!validatedId.success) {
        console.error("Invalid ID parameter:", validatedId.error);
        return null;
    }

    // Disable caching for this function
    noStore();

    // Fetch the savings goal by its ID from the database
    try {
        const savingsGoal = await prisma.savingsGoal.findUnique({
            where: {
                id: validatedId.data,
                userId: userId, // Filter by authenticated user's ID
            },
            select: {
                id: true,
                name: true,
                amount: true,
                categoryId: true,
            },
        });
        return savingsGoal;
    } catch (error) {
        console.error("Failed to fetch savings goal:", error);
        throw new Error("Failed to fetch savings goal.");
    }
};

/**
 * Fetches the total number of pages for the savings goals pagination.
 *
 * @param {string} query - The query string to filter the savings goals.
 * @returns {Promise<number>} - A promise that resolves to the total number of pages.
 * @throws {Error} - Throws an error if fetching the total number of pages fails.
 */
const fetchSavingsGoalsPages = async (query: string): Promise<number> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate the query parameter using Zod
    const validatedQuery = QuerySchema.safeParse(query);
    if (!validatedQuery.success) {
        console.error("Invalid query parameter:", validatedQuery.error);
        throw new Error("Invalid query parameter.");
    }

    // Disable caching for this function
    noStore();

    try {
        const totalSavingsGoals = await prisma.savingsGoal.count({
            where: {
                name: {
                    contains: validatedQuery.data,
                    mode: "insensitive",
                },
                userId: userId, // Filter by authenticated user's ID
            },
        });
        // Calculate the total number of pages
        const pagesCount = Math.ceil(
            totalSavingsGoals / SAVINGS_GOALS_PER_PAGE
        );

        return pagesCount;
    } catch (error) {
        console.error("Failed to fetch savings goals pages:", error);
        throw new Error("Failed to fetch savings goals pages.");
    }
};

/**
 * Fetches grouped savings goals for the authenticated user.
 *
 * @returns {Promise<DataByCategories[]>} - A promise that resolves to an array of categories with savings goals.
 * @throws {Error} - Throws an error if fetching grouped savings goals fails.
 */
const fetchGroupedSavingsGoals = async (): Promise<DataByCategories[]> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching for this function
    noStore();

    try {
        const categoriesWithGoals = await prisma.category.findMany({
            where: {
                savingsGoals: {
                    some: {
                        userId: userId, // Filter by authenticated user's ID
                    },
                },
            },
            select: {
                id: true,
                name: true,
                savingsGoals: {
                    select: {
                        id: true,
                        name: true,
                        amount: true,
                        contributions: {
                            select: {
                                amount: true,
                            },
                        },
                    },
                },
            },
        });

        // Calculate total amount for each savings goal
        const categoriesWithTotalContributions = categoriesWithGoals.map(
            (category) => {
                const totalAmount = category.savingsGoals.reduce(
                    (sum, goal) => sum + goal.amount,
                    0
                );
                return {
                    categoryId: category.id,
                    categoryName: category.name,
                    totalAmount: totalAmount,
                };
            }
        );

        return categoriesWithTotalContributions;
    } catch (error) {
        console.error("Failed to fetch saving goals:", error);
        throw new Error("Failed to fetch saving goals.");
    }
};

export {
    fetchFilteredSavingGoals,
    fetchSavingsGoalById,
    fetchSavingsGoalsPages,
    fetchGroupedSavingsGoals,
};
