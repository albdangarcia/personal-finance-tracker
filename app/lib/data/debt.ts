import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import { DebtById, CategoriesWithDebts, CardAmounts } from "../interfaces";

// Limit the number of debts per page
const DEBTS_PER_PAGE = 10;

const fetchDebts = async (
    query: string,
    currentPage: number
): Promise<CategoriesWithDebts[]> => {
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
    // Disable caching for this function
    noStore();

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

const fetchDebtById = async (id: string): Promise<DebtById | null> => {
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

const fetchDebtTotalAmount = async (): Promise<CardAmounts> => {
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
