import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import {
    CardAmounts,
    DataByCategories,
    ExpenseById,
    MonthlyObject,
} from "../interfaces";
import getCurrentYearMonth from "../utils/currentYearMonth";
import {
    IdSchema,
    QuerySchema,
    YearMonthSchema,
} from "../zod-schemas";
import { getAuthenticatedUserId } from "../utils/authUtils";

// Limit the number of expenses per page
const EXPENSES_PER_PAGE = 10;

/**
 * Fetches an expense by its ID from the database.
 *
 * @param {string} id - The ID of the expense to fetch.
 * @returns {Promise<ExpenseById | null>} - A promise that resolves to the expense object if found, otherwise null.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
const fetchExpenseById = async (id: string): Promise<ExpenseById | null> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching for this function
    noStore();

    // Validate the expense ID using Zod
    const validatedId = IdSchema.safeParse(id);
    if (!validatedId.success) {
        console.error("Invalid Expense ID:", validatedId.error);
        return null;
    }

    // Fetch the expense by its ID from the database using Prisma
    try {
        const expense = await prisma.expense.findUnique({
            where: {
                id: validatedId.data,
                userId: userId, // Filter by authenticated user's ID
            },
            select: {
                id: true,
                name: true,
                amount: true,
                date: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return expense;
    } catch (error) {
        console.error("Failed to fetch expense:", error);
        throw new Error("Failed to fetch expense.");
    }
};

/**
 * Fetches expenses grouped by category for a given year and month.
 *
 * @param {string} year - The year for which to fetch expenses.
 * @param {string} month - The month for which to fetch expenses.
 * @returns {Promise<DataByCategories[]>} - A promise that resolves to an array of expenses grouped by category.
 * @throws {Error} - Throws an error if the year or month parameters are invalid or if fetching expenses fails.
 */
const fetchExpensesByCategory = async (
    year: string,
    month: string
): Promise<DataByCategories[]> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching
    noStore();

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
        // Fetch expenses grouped by categoryId
        const expenses = await prisma.expense.findMany({
            where: {
                yearMonth: yearMonth,
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
        const groupByCategory = expenses.reduce<DataByCategories[]>(
            (accumulator, expense) => {
                // Extract categoryId and categoryName
                const categoryId = expense.categoryId;
                const categoryName = expense.category.name;

                // Find if the category already exists in the accumulator
                const existingCategory = accumulator.find(
                    (item) => item.categoryId === categoryId
                );

                if (existingCategory) {
                    // If the category exists, add the amount to the total
                    existingCategory.totalAmount += expense.amount;
                } else {
                    // If the category does not exist, create a new category entry
                    accumulator.push({
                        categoryId: categoryId,
                        categoryName: categoryName,
                        totalAmount: expense.amount,
                    });
                }

                // Return the updated accumulator for the next iteration
                return accumulator;
            },
            [] // Initial value of the accumulator is an empty array
        );

        return groupByCategory;
    } catch (error) {
        console.error("Failed to fetch expenses by category:", error);
        throw new Error("Failed to fetch expenses by category.");
    }
};

/**
 * Fetches filtered expenses for a given query, year, and month, with pagination support.
 *
 * @param {string} query - The search query to filter expenses by name.
 * @param {number} currentPage - The current page number for pagination.
 * @param {string} year - The year for which to fetch expenses.
 * @param {string} month - The month for which to fetch expenses.
 * @returns {Promise<ExpenseById[]>} - A promise that resolves to an array of filtered expenses.
 * @throws {Error} - Throws an error if the year, month, or query parameters are invalid or if fetching expenses fails.
 */
const fetchFilteredExpenses = async (
    query: string,
    currentPage: number,
    year: string,
    month: string
): Promise<ExpenseById[]> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching
    noStore();

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

    // Use the validated year and month
    const yearMonth = `${validatedYear}-${validatedMonth}`;

    // Validate the query parameter using Zod
    const validatedQuery = QuerySchema.safeParse(query);
    if (!validatedQuery.success) {
        console.error("Invalid query parameter:", validatedQuery.error);
        return [];
    }

    // Calculate the offset based on the current page
    const offset = (currentPage - 1) * EXPENSES_PER_PAGE;

    // Fetch expenses from the database using Prisma:
    // - Skip a certain number of records based on the offset for pagination.
    // - Limit the number of records returned to the value of EXPENSES_PER_PAGE.
    try {
        const expenses = await prisma.expense.findMany({
            where: {
                yearMonth: yearMonth,
                name: {
                    contains: validatedQuery.data,
                    mode: "insensitive",
                },
                userId: userId, // Filter by authenticated user's ID
            },
            select: {
                id: true,
                amount: true,
                name: true,
                date: true,
                yearMonth: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
            skip: offset,
            take: EXPENSES_PER_PAGE,
        });

        return expenses;
    } catch (error) {
        console.error("Failed to fetch filtered expenses:", error);
        throw new Error("Failed to fetch filtered expenses.");
    }
};

/**
 * Fetches and calculates the total expenses for the last six months.
 *
 * @returns {Promise<MonthlyObject[]>} A promise that resolves to an array of objects,
 * each representing the total expenses for a month in the last six months.
 *
 */
const fetchLastSixMonthsExpenses = async (): Promise<MonthlyObject[]> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching
    noStore();

    // Calculate the date six months ago
    const sixMonthsAgoDate = new Date();
    sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() - 6);

    // Fetch the expenses for the last six months
    const expenses = await prisma.expense.groupBy({
        by: ["yearMonth"],
        where: {
            date: {
                gte: sixMonthsAgoDate,
            },
            userId: userId, // Filter by authenticated user's ID
        },
        _sum: {
            amount: true,
        },
    });

    // Create a map of the fetched expenses with yearMonth as the key and total amount as the value
    const expensesMap = new Map(
        expenses.map((expense) => [expense.yearMonth, expense._sum.amount])
    );

    // Get the current date
    const currentDate = new Date();

    // Initialize an array to hold the last six months' data
    const lastSixMonths: MonthlyObject[] = [];

    for (let i = 0; i < 6; i++) {
        // Create a date object for the current month minus i months
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
        );

        // Format the date as "YYYY-MM"
        const yearMonth = `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}`;

        // Get the total amount for the month from the expenses map, defaulting to 0 if not found
        const totalAmount = expensesMap.get(yearMonth) || 0;

        // Get the month name in long format (e.g., "January")
        const monthLabel = date.toLocaleString("default", { month: "long" });

        // Add the month label and total amount to the beginning of the lastSixMonths array
        lastSixMonths.unshift({ monthLabel, totalAmount });
    }

    // Return the array of the last six months with their respective total amounts
    return lastSixMonths;
};

/**
 * Fetches the total number of pages of expenses based on a query, year, and month.
 *
 * @param {string} query - The search query to filter expenses by name.
 * @param {string} year - The year for which to fetch expenses.
 * @param {string} month - The month for which to fetch expenses.
 * @returns {Promise<number>} - A promise that resolves to the total number of pages of expenses.
 * @throws {Error} - Throws an error if the year or month parameters are invalid or if fetching the expenses page count fails.
 */
const fetchExpensePages = async (
    query: string,
    year: string,
    month: string
): Promise<number> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching
    noStore();

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

    // Use the validated year and month
    const yearMonth = `${validatedYear}-${validatedMonth}`;

    // Fetch the total number of expenses based on the query
    try {
        const expensesCount = await prisma.expense.count({
            where: {
                yearMonth: yearMonth,
                name: {
                    contains: query,
                    mode: "insensitive",
                },
                userId: userId, // Filter by authenticated user's ID
            },
        });

        // Calculate the total number of pages
        const totalPages = Math.ceil(expensesCount / EXPENSES_PER_PAGE);

        return totalPages;
    } catch (error) {
        console.error("Failed to fetch expenses page count:", error);
        throw new Error("Failed to fetch expenses page count.");
    }
};

/**
 * Fetches the total amount of expenses for the current and previous month for the authenticated user.
 *
 * @returns {Promise<CardAmounts>} - A promise that resolves to an object containing the total expense amount for the current and previous month.
 * @throws {Error} - Throws an error if fetching the total expense amount fails.
 */
const fetchExpenseTotalAmount = async (): Promise<CardAmounts> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching
    noStore();

    // Get the current date
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    try {
        // Fetch the total amount of expenses
        const totalAmount = await prisma.expense.aggregate({
            where: {
                yearMonth: `${year}-${month}`,
                userId: userId, // Filter by authenticated user's ID
            },
            _sum: {
                amount: true,
            },
        });

        // Fetch the total amount of expenses for the previous month
        const previousTotalAmount = await prisma.expense.aggregate({
            where: {
                yearMonth: `${year}-${String(now.getMonth()).padStart(2, "0")}`,
                userId: userId, // Filter by authenticated user's ID
            },
            _sum: {
                amount: true,
            },
        });

        return {
            expenseAmount: totalAmount._sum.amount ?? 0,
            previousExpenseAmount: previousTotalAmount._sum.amount ?? 0,
        };
    } catch (error) {
        console.error("Failed to fetch total expense amount:", error);
        throw new Error("Failed to fetch total expense amount.");
    }
};

export {
    fetchExpenseById,
    fetchExpensesByCategory,
    fetchExpensePages,
    fetchFilteredExpenses,
    fetchLastSixMonthsExpenses,
    fetchExpenseTotalAmount,
};
