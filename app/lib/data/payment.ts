import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import { DebtWithPayments, PaymentById } from "../interfaces";
import { getAuthenticatedUserId } from "../utils/authUtils";
import { IdSchema } from "../zod-schemas";

/**
 * Fetches payments for a debt by its ID for the authenticated user.
 * @param {string} id - The ID of the debt to fetch payments for.
 * @returns {Promise<DebtWithPayments | null>} - A promise that resolves to the debt object with payments or null if not found.
 * @throws {Error} - Throws an error if the ID parameter is invalid or if fetching payments fails.
 */
const fetchPaymentsByDebtId = async (
    id: string
): Promise<DebtWithPayments | null> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate the ID parameter using Zod
    const validatedId = IdSchema.safeParse(id);
    if (!validatedId.success) {
        console.error("Invalid ID parameter:", validatedId.error);
        return null;
    }

    // Disable caching for this function
    noStore();

    try {
        const debtWithPayments = await prisma.debt.findUnique({
            where: {
                id: validatedId.data,
                userId: userId, // Filter by authenticated user's ID
            },
            select: {
                id: true,
                name: true,
                amount: true,
                interest: true,
                payments: {
                    select: {
                        id: true,
                        amount: true,
                        date: true,
                    },
                    orderBy: {
                        date: "desc",
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return debtWithPayments;
    } catch (error) {
        console.error("Failed to fetch payments:", error);
        throw new Error("Failed to fetch payments.");
    }
};

/**
 * Fetches a payment by its ID for the authenticated user.
 * @param {string} id - The ID of the payment to fetch.
 * @returns {Promise<PaymentById | null>} - A promise that resolves to the payment object or null if not found.
 * @throws {Error} - Throws an error if the ID parameter is invalid or if fetching the payment fails.
 * */
const fetchPaymentById = async (id: string): Promise<PaymentById | null> => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate the ID parameter using Zod
    const validatedId = IdSchema.safeParse(id);
    if (!validatedId.success) {
        console.error("Invalid ID parameter:", validatedId.error);
        return null;
    }

    // Disable caching for this function
    noStore();

    try {
        const payment = await prisma.debtPayment.findFirst({
            where: {
                id: validatedId.data,
                debt: {
                    userId: userId,
                },
            },
            select: {
                id: true,
                amount: true,
                date: true,
                debt: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return payment;
    } catch (error) {
        console.error("Failed to fetch payment:", error);
        throw new Error("Failed to fetch payment.");
    }
};

export { fetchPaymentsByDebtId, fetchPaymentById };
