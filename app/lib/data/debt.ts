import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import { Debt, DebtWithCategories } from "../interfaces";

// Limit the number of debts per page
const DEBTS_PER_PAGE = 10;

const fetchDebts = async (
    query: string,
    currentPage: number
): Promise<DebtWithCategories[]> => {
    // Disable caching for this function
    noStore();

    const offset = (currentPage - 1) * DEBTS_PER_PAGE;

    try {
        const debts = await prisma.category.findMany({
            where: {
                debts: {
                    some: {
                        name: {
                            contains: query,
                            mode: "insensitive",
                        },
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

const fetchDebtsPages = async (query: string): Promise<number> => {
    try {
        const totalDebts = await prisma.debt.count({
            where: {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
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

const fetchDebtById = async (id: string): Promise<Debt | null> => {
    // Disable caching for this function
    noStore();

    try {
        const debt = await prisma.debt.findUnique({
            where: {
                id: id,
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

export { fetchDebts, fetchDebtsPages, fetchDebtById };
