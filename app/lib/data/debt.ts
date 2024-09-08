import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import { DebtById, CategoriesWithDebts, CardAmounts } from "../interfaces";
import { getAuthenticatedUserId } from "../utils/authUtils";
import { IdSchema, QuerySchema } from "../zod-schemas";

// Limit the number of debts per page
const DEBTS_PER_PAGE = 10;

/**
 * Fetches debts for the authenticated user based on a query and paginates the results.
 *
 * @param {string} query - The search query to filter debts by name.
 * @param {number} currentPage - The current page number for pagination.
 * @returns {Promise<CategoriesWithDebts[]>} - A promise that resolves to an array of categories with debts.
 * @throws {Error} - Throws an error if the query parameter is invalid or if fetching debts fails.
 */
const fetchDebts = async (
    query: string,
    currentPage: number
): Promise<CategoriesWithDebts[]> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate the query parameter using Zod
    const validatedQuery = QuerySchema.safeParse(query);
    if (!validatedQuery.success) {
        console.error("Invalid query parameter:", validatedQuery.error);
        return [];
    }

    // Disable caching for this function
    noStore();

    // Calculate the offset based on the current page
    const offset = (currentPage - 1) * DEBTS_PER_PAGE;

    try {
        const debts = await prisma.category.findMany({
            where: {
                debts: {
                    some: {
                        name: {
                            contains: validatedQuery.data,
                            mode: "insensitive",
                        },
                        userId: userId, // Filter by authenticated user's ID
                    },
                },
            },
            select: {
                id: true,
                name: true,
                debts: {
                    select: {
                        id: true,
                        name: true,
                        amount: true,
                        interest: true,
                        payments: {
                            select: {
                                amount: true,
                            },
                        },
                    },
                },
            },
            skip: offset,
            take: DEBTS_PER_PAGE,
        });

        const debtTotalPayments = debts.map((category) => {
            const updatedPayment = category.debts.map((debt) => {
                const totalPayments = debt.payments.reduce(
                    (sum, payment) => sum + payment.amount,
                    0
                );
                return {
                    ...debt,
                    totalPayments: totalPayments,
                };
            });
            return {
                ...category,
                debts: updatedPayment,
            };
        });

        return debtTotalPayments;
    } catch (error) {
        console.error("Failed to fetch debts:", error);
        throw new Error("Failed to fetch debts");
    }
};

/**
 * Fetches the total number of pages of debts based on a query for the authenticated user.
 *
 * @param {string} query - The search query to filter debts by name.
 * @returns {Promise<number>} - A promise that resolves to the total number of pages of debts.
 * @throws {Error} - Throws an error if the query parameter is invalid or if fetching the debts page count fails.
 */
const fetchDebtsPages = async (query: string): Promise<number> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching for this function
    noStore();

    // Validate the query parameter using Zod
    const validatedQuery = QuerySchema.safeParse(query);
    if (!validatedQuery.success) {
        console.error("Invalid query parameter:", validatedQuery.error);
        throw new Error("Invalid query parameter");
    }

    try {
        const totalDebts = await prisma.debt.count({
            where: {
                name: {
                    contains: validatedQuery.data,
                    mode: "insensitive",
                },
                userId: userId, // Filter by authenticated user's ID
            },
        });

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalDebts / DEBTS_PER_PAGE);

        return totalPages;
    } catch (error) {
        console.error("Failed to fetch debts pages:", error);
        throw new Error("Failed to fetch debts pages");
    }
};

/**
 * Fetches a debt by its ID for the authenticated user.
 *
 * @param {string} id - The ID of the debt to fetch.
 * @returns {Promise<DebtById | null>} - A promise that resolves to the debt object if found, or null if not found.
 * @throws {Error} - Throws an error if fetching the debt fails.
 */
const fetchDebtById = async (id: string): Promise<DebtById | null> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate the debt ID using Zod
    const validatedId = IdSchema.safeParse(id);
    if (!validatedId.success) {
        console.error("Invalid Debt ID:", validatedId.error);
        return null;
    }

    // Disable caching for this function
    noStore();

    try {
        const debt = await prisma.debt.findUnique({
            where: {
                id: validatedId.data,
                userId: userId, // Filter by authenticated user's ID
            },
            select: {
                id: true,
                name: true,
                categoryId: true,
                interest: true,
                amount: true,
            },
        });

        return debt;
    } catch (error) {
        console.error("Failed to fetch debt by id:", error);
        throw new Error("Failed to fetch debt by id");
    }
};

/**
 * Fetches the total debt amount for the current year and the previous year for the authenticated user.
 *
 * @returns {Promise<CardAmounts>} - A promise that resolves to an object containing the total debt amount for the current year and the previous year.
 * @throws {Error} - Throws an error if fetching the total debt amount fails.
 */
const fetchDebtTotalAmount = async (): Promise<CardAmounts> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Disable caching for this function
    noStore();

    // Get the current date
    const now = new Date();
    const startOfCurrentYear = new Date(now.getFullYear(), 0, 1);
    const startOfPreviousYear = new Date(now.getFullYear() - 1, 0, 1);
    const endOfPreviousYear = new Date(now.getFullYear(), 0, 1);

    try {
        // Fetch the total debt amount
        const debtAmount = await prisma.debt.aggregate({
            where: {
                createdAt: {
                    gte: startOfCurrentYear,
                },
                userId: userId, // Filter by authenticated user's ID
            },
            _sum: {
                amount: true,
            },
        });

        // Fetch the previous total debt amount
        const previousDebtAmount = await prisma.debt.aggregate({
            where: {
                createdAt: {
                    gte: startOfPreviousYear,
                    lt: endOfPreviousYear,
                },
                userId: userId, // Filter by authenticated user's ID
            },
            _sum: {
                amount: true,
            },
        });

        return {
            debtAmount: debtAmount._sum.amount ?? 0,
            previousDebtAmount: previousDebtAmount._sum.amount ?? 0,
        };
    } catch (error) {
        console.error("Failed to fetch debt total amount:", error);
        throw new Error("Failed to fetch debt total amount");
    }
};

export { fetchDebts, fetchDebtsPages, fetchDebtById, fetchDebtTotalAmount };
