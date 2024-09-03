import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import { CategoriesWithGoals, SavingsGoalById } from "../interfaces";

/**
 * Fetches filtered savings goals from the database based on a query string and the current page number.
 * 
 * @param {string} query - The query string to filter savings goals by name.
 * @param {number} currentPage - The current page number for pagination.
 * @returns {Promise<CategoriesWithGoals[]>} - A promise that resolves to an array of categories with their savings goals and total contributions.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
const fetchFilteredSavingGoals = async (
    query: string,
    currentPage: number
): Promise<CategoriesWithGoals[]> => {
    // Disable caching for this function
    noStore();

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
                            contains: query,
                            mode: "insensitive",
                        },
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
}

/**
 * Fetches a savings goal by its ID from the database.
 * 
 * @param {string} id - The ID of the savings goal to fetch.
 * @returns {Promise<SavingsGoalById | null>} - A promise that resolves to the savings goal object if found, otherwise null.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
const fetchSavingsGoalById = async (id: string): Promise<SavingsGoalById | null> => {
    // Disable caching for this function
    noStore();

    // Fetch the savings goal by its ID from the database
    try {
        const savingsGoal = await prisma.savingsGoal.findUnique({
            where: {
                id: id,
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
}

// Define the number of savings goals per page
const SAVINGS_GOALS_PER_PAGE = 10;

/**
 * Fetches the total number of pages for savings goals based on a query string.
 * 
 * @param {string} query - The query string to filter savings goals by name.
 * @returns {Promise<number>} - A promise that resolves to the total number of pages.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
const fetchSavingsGoalsPages = async (query: string): Promise<number> => {
    // Disable caching for this function
    noStore();

    try {
        const totalSavingsGoals = await prisma.savingsGoal.count({
            where: {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
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
}

export { fetchFilteredSavingGoals, fetchSavingsGoalById, fetchSavingsGoalsPages };