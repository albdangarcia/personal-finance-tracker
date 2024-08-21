import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";

type BudgetCategories = {
    id: string;
    name: string;
};
/**
 * Fetches categories that do not have a budget.
 * 
 * @returns {Promise<BudgetCategories[]>} - A promise that resolves to an array of categories without a budget.
 */
const fetchAvailableBudgetCategories = async (): Promise<BudgetCategories[]> => {
    // Disable caching for this function
    noStore();
    
    // Fetch categories that do not have a budget
    try {
        const categories = await prisma.category.findMany({
            where: {
                budget: {
                    is: null, // Ensures that only categories without a budget are returned
                },
            },
            select: {
                id: true,
                name: true,
            },
        });

        return categories;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        throw new Error("Failed to fetch categories.");
    }
}

type SortedBudgetCategories = {
    totalExpenses: number;
    name: string;
    budget: {
        id: string;
        amount: number;
    } | null;
    expenses: {
        amount: number;
    }[];
};

/**
 * Fetches categories with budgets that match the given query, calculates total expenses for each category,
 * and sorts the categories by the difference between the budget amount and total expenses.
 * 
 * @param {string} query - The query string to filter categories by name.
 * @returns {Promise<SortedBudgetCategories[]>} - A promise that resolves to an array of sorted categories with budgets.
 */
const fetchUsedCategoryWithBudget = async (
    query: string
): Promise<SortedBudgetCategories[]> => {
    // Disable caching for this function
    noStore();

    // Fetch all categories with budget and ignore the other categories
    try {
        const categoriesWithBudget = await prisma.category.findMany({
            where: {
                budget: {
                    isNot: null, // Ensures that only categories with a budget are returned
                },
                name: {
                    contains: query,
                    mode: "insensitive",
                },
            },
            select: {
                name: true,
                budget: {
                    select: {
                        id: true,
                        amount: true,
                    },
                },
                expenses: {
                    select: {
                        amount: true,
                    },
                },
            },
        });

        // Add totalExpenses property to each category
        const categoriesWithTotalExpenses = categoriesWithBudget.map(
            (category) => {
                const totalExpenses = category.expenses.reduce(
                    (sum, expense) => sum + expense.amount,
                    0
                );
                return {
                    ...category,
                    totalExpenses,
                };
            }
        );

        // Calculate the difference between amount and total expenses, and sort by this difference
        const sortedCategories = categoriesWithTotalExpenses.sort((a, b) => {
            const aDifference = (a.budget?.amount ?? 0) - a.totalExpenses;
            const bDifference = (b.budget?.amount ?? 0) - b.totalExpenses;
            return aDifference - bDifference;
        });

        // Return the sorted categories
        return sortedCategories;
    } catch (error) {
        console.error("Failed to fetch Category with Budgets:", error);
        throw new Error("Failed to fetch Category with Budgets.");
    }
};

type BudgetById = {
    id: string;
    category: {
        id: string;
        name: string;
    };
    amount: number;
};
/**
 * Fetches a budget by its ID from the database.
 *
 * @param {string} id - The ID of the budget to fetch.
 * @returns {Promise<BudgetById|null>} The budget object if found, otherwise null.
 */
const fetchBudgetById = async (id: string): Promise<BudgetById | null> => {
    // Disable caching for this function
    noStore();

    // Fetch the budget from the database using Prisma
    try {
        const budget = await prisma.budget.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                amount: true,
            },
        });
        return budget;
    } catch (error) {
        console.error("Failed to fetch budget:", error);
        throw new Error("Failed to fetch budget.");
    }
};

export { fetchBudgetById, fetchUsedCategoryWithBudget, fetchAvailableBudgetCategories };
