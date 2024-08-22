import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import { BudgetByIdType, FilteredBudgets } from "../types";
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
                                date: true,
                            },
                        },
                    },
                },
            },
        });

        const results = budgets.map((budget) => {
            const totalExpenses = budget.category.expenses
                .filter((expense) => {
                    // Create a Date object from the expense date
                    const expenseDate = new Date(expense.date);
                    // Extract year and month, format as YYYY-MM
                    const expenseyearMonth = `${expenseDate.getFullYear()}-${String(
                        expenseDate.getMonth() + 1
                    ).padStart(2, "0")}`;
                    // Check if the expense year and month match the budget year and month
                    return expenseyearMonth === validatedYearMonth;
                })
                // Sum the amounts of the filtered expenses
                .reduce((sum, expense) => sum + expense.amount, 0);

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

export { fetchBudgetById, fetchFilteredBudgets };
