import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import {
    BudgetById,
    CardAmounts,
    FilteredBudgets,
    MonthlyObject,
} from "../interfaces";
import getCurrentYearMonth from "../utils/currentYearMonth";
import { IdSchema, QuerySchema, YearMonthSchema } from "../zod-schemas";
import { getAuthenticatedUserId } from "../utils/authUtils";

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
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching for this function
    noStore();

    // Validate the query parameter using Zod
    const validatedQuery = QuerySchema.safeParse(query);
    if (!validatedQuery.success) {
        console.error("Invalid query parameter:", validatedQuery.error);
        return [];
    }

    // If year or month is not provided, get the current year and month
    if (!year || !month) {
        const currentYearMonth = getCurrentYearMonth();
        [year, month] = currentYearMonth.split("-");
    }

    // Validate the year and month parameters
    const validationResult = YearMonthSchema.safeParse({ year, month });
    if (!validationResult.success) {
        console.error(
            "Invalid year or month parameter:",
            validationResult.error
        );
        throw new Error("Invalid year or month parameter");
    }

    // Extract year and month from the validated data
    const { year: validatedYear, month: validatedMonth } =
        validationResult.data;

    const yearMonth = `${validatedYear}-${validatedMonth}`;

    try {
        const budgets = await prisma.budget.findMany({
            where: {
                yearMonth: yearMonth,
                userId: userId,
                category: {
                    name: {
                        contains: validatedQuery.data,
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
                    // If the expense's yearMonth matches the yearMonth, add its amount to the sum
                    return expense.yearMonth === yearMonth
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
        console.error("Database Error: Failed to Fetch Budgets.", error);
        throw new Error("Database Error: Failed to Fetch Budgets.");
    }
};

/**
 * Fetches a budget by its ID from the database.
 *
 * @param {string} id - The ID of the budget to fetch.
 * @returns {Promise<BudgetById | null>} The budget object if found, otherwise null.
 */
const fetchBudgetById = async (id: string): Promise<BudgetById | null> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching for this function
    noStore();

    // Validate the budget ID using Zod
    const validatedId = IdSchema.safeParse(id);
    if (!validatedId.success) {
        console.error("Invalid Budget ID:", validatedId.error);
        return null;
    }

    // Fetch the budget from the database using Prisma
    try {
        const budget = await prisma.budget.findUnique({
            where: {
                id: validatedId.data,
                userId: userId,
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
 * @returns {Promise<MonthlyObject[]>} A promise that resolves to an array of objects,
 * each containing the month name and the total amount for that month.
 *
 */
const fetchLastSixMonthsBudgets = async (): Promise<MonthlyObject[]> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

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
            userId: userId,
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
            monthLabel: monthLabel,
            totalAmount: totalAmount,
        });
    }

    return lastSixMonths;
};

/**
 * Fetches the total budget amounts for the current and previous month.
 *
 * @returns {Promise<CardAmounts>} A promise that resolves to an object containing the current and previous total amounts.
 */
const fetchBudgetTotalAmount = async (): Promise<CardAmounts> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching for this function
    noStore();

    // Get the current date
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
    const previousMonth = String(now.getMonth()).padStart(2, "0");

    // Get the total amount for the current month
    const totalAmount = await prisma.budget.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            userId: userId,
            yearMonth: `${currentYear}-${currentMonth}`,
        },
    });

    // Get the total amount for the previous month
    const previousTotalAmount = await prisma.budget.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            userId: userId,
            yearMonth: `${currentYear}-${previousMonth}`,
        },
    });

    return {
        budgetAmount: totalAmount._sum.amount || 0,
        previousBudgetAmount: previousTotalAmount._sum.amount || 0,
    };
};

export {
    fetchBudgetById,
    fetchFilteredBudgets,
    fetchLastSixMonthsBudgets,
    fetchBudgetTotalAmount,
};
