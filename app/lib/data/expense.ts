import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import {
    CardAmounts,
    DataByCategories,
    ExpenseById,
    MonthlyObject,
} from "../interfaces";
import getCurrentYearMonth from "../utils/currentYearMonth";
import { YearMonthSchema } from "../zod-schemas";

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
    // Disable caching for this function
    noStore();

    // Fetch the expense by its ID from the database using Prisma
    try {
        const expense = await prisma.expense.findUnique({
            where: {
                id: id,
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

const fetchExpensesByCategory = async (
    year: string,
    month: string
): Promise<DataByCategories[]> => {
    // Disable caching
    noStore();

    let yearMonth: string;
    // If year or month is not provided, get the current year and month
    if (!year || !month) {
        yearMonth = getCurrentYearMonth();
    } else {
        yearMonth = `${year}-${month}`;
    }

    try {
        // Fetch expenses grouped by categoryId
        const expenses = await prisma.expense.findMany({
            where: {
                yearMonth: yearMonth,
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

const fetchFilteredExpenses = async (
    query: string,
    currentPage: number,
    year: string,
    month: string
): Promise<ExpenseById[]> => {
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
    }
    const validatedYearMonth = validated.data;

    // Calculate the offset based on the current page
    const offset = (currentPage - 1) * EXPENSES_PER_PAGE;

    // Fetch expenses from the database using Prisma:
    // - Skip a certain number of records based on the offset for pagination.
    // - Limit the number of records returned to the value of EXPENSES_PER_PAGE.
    try {
        const expenses = await prisma.expense.findMany({
            where: {
                yearMonth: validatedYearMonth,
                name: {
                    contains: query,
                    mode: "insensitive",
                },
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

const fetchExpensePages = async (
    query: string,
    year: string,
    month: string
): Promise<number> => {
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
        return 0;
    }
    const validatedYearMonth = validated.data;

    // Fetch the total number of expenses based on the query
    try {
        const expensesCount = await prisma.expense.count({
            where: {
                yearMonth: validatedYearMonth,
                name: {
                    contains: query,
                    mode: "insensitive",
                },
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

const fetchExpenseTotalAmount = async (): Promise<CardAmounts> => {
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
            },
            _sum: {
                amount: true,
            },
        });

        // Fetch the total amount of expenses for the previous month
        const previousTotalAmount = await prisma.expense.aggregate({
            where: {
                yearMonth: `${year}-${String(now.getMonth()).padStart(2, "0")}`,
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
}

export {
    fetchExpenseById,
    fetchExpensesByCategory,
    fetchExpensePages,
    fetchFilteredExpenses,
    fetchLastSixMonthsExpenses,
    fetchExpenseTotalAmount,
};
