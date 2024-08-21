import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";

type ExpenseById = {
    id: string;
    name: string;
    amount: number;
    date: Date;
    category: {
        id: string;
        name: string;
    };
};

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

type ExpensesByCategory = {
    _sum: {
        amount: number | null;
    };
    category:
        | {
              id: string;
              name: string;
          }
        | undefined;
};

/**
 * Fetches expenses for the charts grouped by category from the database and combines them with category details.
 *
 * @returns {Promise<ExpensesByCategory[]>} - A promise that resolves to an array of objects containing:
 * - `sum`: The sum of expenses for the category.
 * - `category`: An object containing category details such as `id` and `name`.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
const fetchExpensesByCategory = async (): Promise<ExpensesByCategory[]> => {
    // Disable caching for this function
    noStore();

    try {
        // Fetch expenses grouped by categoryId
        const expensesByCategory = await prisma.expense.groupBy({
            by: ["categoryId"],
            _sum: {
                amount: true,
            },
        });

        // Fetch related category details
        const categoryIds = expensesByCategory.map(
            (expense) => expense.categoryId
        );

        // Fetch categories by their IDs
        const categories = await prisma.category.findMany({
            where: {
                id: {
                    in: categoryIds,
                },
            },
            select: {
                id: true,
                name: true,
            },
        });

        // Combine the results
        const result = expensesByCategory.map((expense) => {
            const category = categories.find(
                (cat) => cat.id === expense.categoryId
            );
            return {
                _sum: expense._sum,
                category: category,
            };
        });

        return result;
    } catch (error) {
        console.error("Failed to fetch expenses by category:", error);
        throw new Error("Failed to fetch expenses by category.");
    }
};

// Limit the number of expenses per page
const EXPENSES_PER_PAGE = 10;

/**
 * Fetches the total number of pages for expenses based on a query string.
 *
 * @param {string} query - The query string to filter expenses by name.
 * @returns {Promise<number>} - A promise that resolves to the total number of pages.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
const fetchExpensePages = async (query: string): Promise<number> => {
    // Disable caching for this function
    noStore();

    // Fetch the total number of expenses based on the query
    try {
        const expensesCount = await prisma.expense.count({
            where: {
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

type FilteredExpenses = {
    id: string;
    name: string;
    amount: number;
    date: Date;
    category: {
        id: string;
        name: string;
    };
};
/**
 * Fetches filtered expenses from the database based on a query string and the current page number.
 *
 * @param {string} query - The query string to filter expenses by name.
 * @param {number} currentPage - The current page number for pagination.
 * @returns {Promise<FilteredExpenses[]>} - A promise that resolves to an array of filtered expense objects.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
const fetchFilteredExpenses = async (
    query: string,
    currentPage: number
): Promise<FilteredExpenses[]> => {
    // Disable caching for this function
    noStore();

    // Calculate the offset based on the current page
    const offset = (currentPage - 1) * EXPENSES_PER_PAGE;

    // Fetch expenses from the database using Prisma:
    // - Skip a certain number of records based on the offset for pagination.
    // - Limit the number of records returned to the value of EXPENSES_PER_PAGE.
    try {
        const expenses = await prisma.expense.findMany({
            where: {
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

export {
    fetchExpenseById,
    fetchExpensesByCategory,
    fetchExpensePages,
    fetchFilteredExpenses,
};
