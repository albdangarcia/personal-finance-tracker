import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import {
    BudgetByIdType,
    FilteredBudgets,
    MonthlyBudgets,
} from "../interfaces";
import getCurrentYearMonth from "../utils/currentMonthYear";
import { YearMonthSchema } from "../zod-schemas";

/**
 * Fetches filtered budgets based on the provided query, year, and month.
 *
 * @param {string} query - The search query to filter budget categories.
 * @param {string} year - The year to filter budgets. If not provided, the current year is used.
 * @param {string} month - The month to filter budgets. If not provided, the current month is used.
 * @returns {Promise<FilteredBudgets[]>} A promise that resolves to an array of filtered budgets.
 *
 * @throws {Error} If the year and month format is invalid.
 * @throws {Error} If there is an error fetching budgets from the database.
 */
const fetchFilteredBudgets = async (
    query: string,
    year: string,
    month: string
): Promise<FilteredBudgets[]> => {
    // Disable caching for this function
    noStore();

    let yearMonth: string;
    // If year or month is not provided, get the current year and month
    if (!year || !month) {
        yearMonth = getCurrentYearMonth();
    } else {
        yearMonth = `${year}-${month}`;
    }

    // zod year month schema
    const validated = YearMonthSchema.safeParse(yearMonth);
    if (!validated.success) {
        return [];
        // throw new Error("Invalid Year and Month.");
    }
    const validatedYearMonth = validated.data;

    try {
        const budgets = await prisma.budget.findMany({
            where: {
                yearMonth: validatedYearMonth,
                category: {
                    name: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
            },
            select: {
                id: true,
                amount: true,
                yearMonth: true,
                category: {
                    select: {
                        name: true,
                        expenses: {
                            select: {
                                amount: true,
                                yearMonth: true,
                            },
                        },
                    },
                },
            },
        });

        // Map over each budget in the budgets array
        const results = budgets.map((budget) => {
            // Calculate the total expenses for the current budget's category
            const totalExpenses = budget.category.expenses.reduce(
                (sum, expense) => {
                    // If the expense's yearMonth matches the validatedYearMonth, add its amount to the sum
                    return expense.yearMonth === validatedYearMonth
                        ? sum + expense.amount
                        : sum; // Otherwise, keep the sum unchanged
                },
                0 // Initialize the sum to 0
            );

            // Return a new object with the budget details and the calculated total expenses
            return {
                id: budget.id,
                amount: budget.amount,
                yearMonth: budget.yearMonth,
                categoryName: budget.category.name,
                totalExpenses: totalExpenses,
            };
        });

        return results;
    } catch (error) {
        throw new Error("Database Error: Failed to Fetch Budgets.");
    }
};

/**
 * Fetches a budget by its ID from the database.
 *
 * @param {string} id - The ID of the budget to fetch.
 * @returns {Promise<BudgetByIdType | null>} The budget object if found, otherwise null.
 */
const fetchBudgetById = async (id: string): Promise<BudgetByIdType | null> => {
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
                yearMonth: true,
                amount: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return budget;
    } catch (error) {
        console.error("Failed to fetch budget:", error);
        throw new Error("Failed to fetch budget.");
    }
};

/**
 * Fetches the budget data for the last six months and aggregates it by month.
 *
 * @returns {Promise<MonthlyBudgets[]>} A promise that resolves to an array of objects,
 * each containing the month name and the total amount for that month.
 *
 */
const fetchLastSixMonthsBudgets = async (): Promise<MonthlyBudgets[]> => {
    // Function to format the date to YYYY-MM
    const formatYearMonth = (date: Date) => date.toISOString().slice(0, 7);

    // Create a new date object starting from the current date
    const sixMonthsAgo = new Date();

    // Subtract 5 months to get the date 6 months ago and set the month
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    // Query to get the budget data for the last 6 months and aggregate by month
    const budgets = await prisma.budget.groupBy({
        // Group the results by yearMonth
        by: ["yearMonth"],
        // Filter budgets where yearMonth is greater than or equal to the formatted date 6 months ago.
        where: {
            yearMonth: {
                gte: formatYearMonth(sixMonthsAgo),
            },
        },
        // Sum the amount for each group.
        _sum: {
            amount: true,
        },
        // Order the results by yearMonth in ascending order.
        orderBy: {
            yearMonth: "asc",
        },
    });

    // Create a map of the months as a key and the total amount as the value
    const budgetMap = new Map(
        budgets.map((budget) => [budget.yearMonth, budget._sum.amount])
    );

    // Initialize an array to hold the last 6 months
    const lastSixMonths = [];

    // Get the current date
    const currentDate = new Date();

    for (let i = 0; i < 6; i++) {
        // Create a new date object starting from the current date
        const tempDate = new Date(currentDate);

        // Subtract i months starting from the current month
        tempDate.setMonth(currentDate.getMonth() - i);

        // Format the date to YYYY-MM
        const formattedYearMonth = formatYearMonth(tempDate);

        // Get the total amount for the month from the map, defaulting to 0 if not found
        const totalAmount = budgetMap.get(formattedYearMonth) || 0;

        // Get the month name from the toLocaleString method
        const monthLabel = tempDate.toLocaleString("default", {
            month: "long",
        });

        // Add the month and total amount to the array from the left starting from the current month
        lastSixMonths.unshift({
            month: monthLabel,
            totalAmount: totalAmount,
        });
    }

    return lastSixMonths;
};

export { fetchBudgetById, fetchFilteredBudgets, fetchLastSixMonthsBudgets };
