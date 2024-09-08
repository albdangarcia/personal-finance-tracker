import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import {
    CardAmounts,
    DataByCategories,
    GroupIncomes,
    IncomeById,
} from "../interfaces";
import { getAuthenticatedUserId } from "../utils/authUtils";
import { IdSchema, QuerySchema } from "../zod-schemas";

/**
 * Fetches filtered incomes for the authenticated user based on a query.
 *
 * @param {string} query - The search query to filter incomes by category name.
 * @returns {Promise<GroupIncomes>} - A promise that resolves to an object containing regular and irregular incomes.
 * @throws {Error} - Throws an error if the query parameter is invalid or if fetching incomes fails.
 */
const fetchFilteredIncomes = async (query: string): Promise<GroupIncomes> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disabled the cache
    noStore();

    // Validate the query parameter using Zod
    const validatedQuery = QuerySchema.safeParse(query);
    if (!validatedQuery.success) {
        console.error("Invalid query parameter:", validatedQuery.error);
        throw new Error("Invalid query parameter.");
    }

    try {
        const categoriesWithincomes = await prisma.income.findMany({
            where: {
                category: {
                    name: {
                        contains: validatedQuery.data,
                        mode: "insensitive",
                    },
                },
                userId: userId, // Filter by authenticated user's ID
            },
            select: {
                id: true,
                amount: true,
                frequency: true,
                startDate: true,
                endDate: true,
                yearMonth: true,
                incomeType: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        // Separate regular and irregular incomes
        const irregularIncomes = categoriesWithincomes.filter(
            (income) => income.incomeType === "IRREGULAR"
        );
        const regularIncomes = categoriesWithincomes.filter(
            (income) => income.incomeType === "REGULAR"
        );

        // Return the incomes
        return { regularIncomes, irregularIncomes };
    } catch (error) {
        throw new Error("Failed to fetch incomes.");
    }
};

/**
 * Fetches an income by its ID for the authenticated user.
 *
 * @param {string} id - The ID of the income to fetch.
 * @returns {Promise<IncomeById | null>} - A promise that resolves to the income object or null if not found.
 * @throws {Error} - Throws an error if the ID parameter is invalid or if fetching the income fails.
 */
const fetchIncomeById = async (id: string): Promise<IncomeById | null> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate the id parameter using Zod
    const validatedId = IdSchema.safeParse(id);
    if (!validatedId.success) {
        console.error("Invalid Income ID:", validatedId.error);
        return null;
    }

    // Disable the cache
    noStore();

    // Fetch the income by id
    try {
        const income = await prisma.income.findUnique({
            where: { id: validatedId.data, userId: userId },
            select: {
                id: true,
                amount: true,
                frequency: true,
                startDate: true,
                endDate: true,
                yearMonth: true,
                incomeType: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return income;
    } catch (error) {
        throw new Error("Failed to fetch income by id.");
    }
};

/**
 * Fetches incomes grouped by category for the authenticated user.
 *
 * @returns {Promise<DataByCategories[]>} - A promise that resolves to an array of objects containing the total income amount for each category.
 * @throws {Error} - Throws an error if fetching incomes by category fails.
 */
const fetchIncomeByCategory = async () => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching
    noStore();

    try {
        // Fetch incomes grouped by categoryId
        const incomes = await prisma.income.findMany({
            where: {
                userId: userId, // Filter by authenticated user's ID
            },
            select: {
                categoryId: true,
                amount: true,
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        // Group by category and calculate the total amount for each category
        const groupByCategory = incomes.reduce<DataByCategories[]>(
            (accumulator, income) => {
                // Extract categoryId and categoryName
                const categoryId = income.categoryId;
                const categoryName = income.category.name;

                // Find if the category already exists in the accumulator
                const existingCategory = accumulator.find(
                    (item) => item.categoryId === categoryId
                );

                if (existingCategory) {
                    // If the category exists, add the amount to the total
                    existingCategory.totalAmount += income.amount;
                } else {
                    // If the category does not exist, create a new category entry
                    accumulator.push({
                        categoryId: categoryId,
                        categoryName: categoryName,
                        totalAmount: income.amount,
                    });
                }

                // Return the updated accumulator for the next iteration
                return accumulator;
            },
            [] // Initial value of the accumulator is an empty array
        );

        return groupByCategory;
    } catch (error) {
        console.error("Failed to fetch incomes by category:", error);
        throw new Error("Failed to fetch incomes by category.");
    }
};

/**
 * Fetches the total income amount for the current month and the previous month for the authenticated user.
 *
 * @returns {Promise<CardAmounts>} - A promise that resolves to an object containing the total income amount for the current month and the previous month.
 * @throws {Error} - Throws an error if fetching the total income amount fails.
 */
const fetchIncomeTotalAmount = async (): Promise<CardAmounts> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching
    noStore();

    // Get the current year and month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    try {
        // Fetch the total amount of incomes
        const totalAmount = await prisma.income.aggregate({
            where: {
                yearMonth: `${year}-${month}`,
                userId: userId, // Filter by authenticated user's ID
            },
            _sum: {
                amount: true,
            },
        });

        // Fetch the total amount of incomes for the previous month
        const previousTotalAmount = await prisma.income.aggregate({
            where: {
                yearMonth: `${year}-${String(now.getMonth()).padStart(2, "0")}`,
                userId: userId, // Filter by authenticated user's ID
            },
            _sum: {
                amount: true,
            },
        });

        return {
            incomeAmount: totalAmount._sum.amount ?? 0,
            previousIncomeAmount: previousTotalAmount._sum.amount ?? 0,
        };
    } catch (error) {
        console.error("Failed to fetch total income amount:", error);
        throw new Error("Failed to fetch total income amount.");
    }
};

export {
    fetchFilteredIncomes,
    fetchIncomeById,
    fetchIncomeByCategory,
    fetchIncomeTotalAmount,
};
