import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import { DebtWithPayments, PaymentById } from "../interfaces";

const fetchPaymentsByDebtId = async (id: string): Promise<DebtWithPayments | null> => {
    // Disable caching for this function
    noStore();

    try {
        const debtWithPayments = await prisma.debt.findUnique({
            where: {
                id: id,
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
}

const fetchPaymentById = async (id: string): Promise<PaymentById | null> => {
    // Disable caching for this function
    noStore();

    try {
        const payment = await prisma.debtPayment.findUnique({
            where: {
                id: id,
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
                }
            },
        });

        return payment;
    } catch (error) {
        console.error("Failed to fetch payment:", error);
        throw new Error("Failed to fetch payment.");
    }
}

export { fetchPaymentsByDebtId, fetchPaymentById };