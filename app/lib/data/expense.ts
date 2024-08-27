import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import {
    ExpenseById,
    ExpensesByCategories,
    FilteredExpenses,
    MonthlyExpenses,
} from "../interfaces";
import getCurrentYearMonth from "../utils/currentMonthYear";
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
): Promise<ExpensesByCategories[]> => {
    // Disable caching for this function
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

        // Reduce the expenses array to a grouped array of expenses by category
        const expensesByCategory = expenses.reduce<ExpensesByCategories[]>(
            (accumulator, expense) => {
                // Extract categoryId and categoryName from the current expense
                const categoryId = expense.categoryId;
                const categoryName = expense.category.name;

                // Find if the category already exists in the accumulator
                const existingCategory = accumulator.find(
                    (item) => item.categoryId === categoryId
                );

                if (existingCategory) {
                    // If the category exists, add the current expense amount to the total
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

        return expensesByCategory;
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
): Promise<FilteredExpenses[]> => {
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
 * @returns {Promise<MonthlyExpenses[]>} A promise that resolves to an array of objects,
 * each representing the total expenses for a month in the last six months.
 *
 */
const fetchLastSixMonthsExpenses = async (): Promise<MonthlyExpenses[]> => {
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
    const lastSixMonths: MonthlyExpenses[] = [];

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

// const fetchLastSixMonthsExpenses = async (): Promise<MonthlyExpenses[]> => {
//     // Calculate the date six months ago
//     const sixMonthsAgoDate = new Date();
//     sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() - 6);

//     // Fetch the expenses for the last six months
//     const expenses = await prisma.expense.findMany({
//         where: {
//             date: {
//                 gte: sixMonthsAgoDate,
//             },
//         },
//     });

//     // Key will be in the format "YYYY-M" (e.g., "2021-8")
//     // Value will be an object with the month label and total amount
//     const expensesMap: { [key: string]: MonthlyExpenses } = {};

//     // Get the current date
//     const currentDate = new Date();

//     // Loop through the last six months starting from the current month
//     // The loop will initialize the expensesMap object with the month label and total amount of 0
//     for (let i = 0; i < 6; i++) {
//         // Create a date object for the first day of the month, i months ago
//         const tempDate = new Date(
//             currentDate.getFullYear(),
//             currentDate.getMonth() - i,
//             1
//         );

//         // Generate a key in the format "YYYY-M" for the current month
//         // getMonth() returns 0-11, so add 1 to get 1-12
//         const yearMonthKey = `${tempDate.getFullYear()}-${
//             tempDate.getMonth() + 1
//         }`;

//         // Create an object with the month label and total amount of 0
//         const expenseObject = {
//             monthLabel: tempDate.toLocaleString("default", { month: "long" }),
//             totalAmount: 0,
//         };

//         // Initialize the expensesMap object with the key and expense object
//         expensesMap[yearMonthKey] = expenseObject;
//     }

//     // Loop through the expenses and add the total amount to the corresponding month
//     expenses.forEach((expense) => {
//         // Get the year from the date object of the expense
//         const year = expense.date.getFullYear();
//         // Get the month from the date object of the expense
//         const month = expense.date.getMonth() + 1;

//         // Create a key for the expensesMap object
//         const key = `${year}-${month}`;

//         // If the key exists, add the amount to the totalAmount
//         expensesMap[key].totalAmount += expense.amount;
//     });

//     // Convert grouped expenses to an array and sort by date (most recent last)
//     const result = Object.entries(expensesMap)
//         // Sort by key (year-month strings) in ascending order
//         .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
//         // Discard the key and return the value { monthLabe, totalAmount }
//         .map(([_, value]) => value);

//     return result;
// };

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

export {
    fetchExpenseById,
    fetchExpensesByCategory,
    fetchExpensePages,
    fetchFilteredExpenses,
    fetchLastSixMonthsExpenses,
};
