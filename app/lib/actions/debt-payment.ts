"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import {
    CreatePaymentFormSchema,
    IdSchema,
    PaymentFormError,
    PaymentFormSchema,
} from "../zod-schemas";
import { getAuthenticatedUserId } from "../utils/authUtils";

const deletePayment = async (id: string, debtId: string) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate the id
    const parsedPaymentId = IdSchema.safeParse(id);

    // If ID validation fails
    if (!parsedPaymentId.success) {
        console.error("Invalid ID format:", parsedPaymentId.error);
        return {
            message: "Invalid ID format",
        };
    }

    // Extract the ID from the validated data
    const validatedPaymentId = parsedPaymentId.data;

    try {
        // Check if the payment exists and belongs to the authenticated user
        const payment = await prisma.debtPayment.findUnique({
            where: {
                id: validatedPaymentId,
                debt: {
                    userId: userId,
                },
            },
            select: {
                id: true,
            },
        });

        // If the payment does not exist or does not belong to the user, return an error
        if (!payment) {
            console.error(
                "Payment not found or user not authorized to delete it."
            );
            return {
                message: "Payment not found or user not authorized to delete it.",
            };
        }

        // Delete the payment
        await prisma.debtPayment.delete({
            where: {
                id: validatedPaymentId,
            },
        });
    } catch (error) {
        console.error("Failed to delete Debt:", error);
        return {
            message: "Database Error: Failed to Delete Payment.",
        };
    }
    // Revalidate the cache
    revalidatePath(`/dashboard/debts/${debtId}/payments`);
};

const createPayment = async (
    debtId: string,
    prevState: PaymentFormError,
    formData: FormData
) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    const parsedDebtId = IdSchema.safeParse(debtId);

    // If ID validation fails, return an error
    if (!parsedDebtId.success) {
        console.error("Invalid ID format:", parsedDebtId.error);
        return {
            message: "Invalid ID format",
        };
    }

    // Validate form fields using Zod
    const validatedFields = CreatePaymentFormSchema.safeParse({
        amount: formData.get("amount"),
        date: formData.get("date"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Payment.",
        };
    }

    // Extract validated fields
    const { amount, date } = validatedFields.data;
    const validatedDebtId = parsedDebtId.data;

    // Create the payment
    try {
        // Verify that the debt belongs to the authenticated user
        const debt = await prisma.debt.findUnique({
            where: { id: validatedDebtId, userId: userId },
            select: { id: true, amount: true },
        });

        // If the debt does not exist
        if (!debt) {
            return {
                message: "Unauthorized access to debt",
            };
        }

        // Calculate the total paid amount for the debt
        const paidAmountResult = await prisma.debtPayment.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                debtId: validatedDebtId,
            },
        });

        const paidAmount = paidAmountResult._sum.amount || 0;

        // Check if the payment amount is valid
        const remainingDebtAmount = debt.amount - paidAmount;
        if (Number(amount) > remainingDebtAmount) {
            console.error("Payment amount exceeds remaining debt amount");
            return {
                message: "Payment amount exceeds remaining debt amount",
            };
        }

        // Create the payment
        await prisma.debtPayment.create({
            data: {
                amount: Number(amount),
                date: new Date(date.toString()),
                debtId: validatedDebtId,
            },
        });
    } catch (error) {
        console.error("Failed to create Payment:", error);
        return {
            message: "Database Error: Failed to Create Payment.",
        };
    }

    // Revalidate the cache
    revalidatePath(`/dashboard/debts/${validatedDebtId}/payments`);

    // Redirect to the payments page
    redirect(`/dashboard/debts/${validatedDebtId}/payments`);
};

const updatePayment = async (
    paymentId: string,
    debtId: string,
    prevState: PaymentFormError,
    formData: FormData
) => {
    // Get the authenticated user's ID
    const userId = await getAuthenticatedUserId();

    // Validate form fields using Zod
    const validatedFields = PaymentFormSchema.safeParse({
        id: paymentId,
        amount: formData.get("amount"),
        date: formData.get("date"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Payment.",
        };
    }

    // Extract validated fields
    const { id, amount, date } = validatedFields.data;

    // Update the payment
    try {
        // Check if the payment exists and belongs to the authenticated user
        const payment = await prisma.debtPayment.findUnique({
            where: {
                id: id,
                debt: {
                    userId: userId,
                },
            },
            select: {
                id: true,
            },
        });

        // If the payment does not exist or does not belong to the user, return an error
        if (!payment) {
            console.error(
                "Payment not found or user not authorized to update it."
            );
            return {
                message: "Payment not found or user not authorized to update it.",
            };
        }

        await prisma.debtPayment.update({
            where: {
                id: id,
            },
            data: {
                amount: Number(amount),
                date: new Date(date.toString()),
            },
        });
    } catch (error) {
        console.error("Failed to update Payment:", error);
        return {
            message: "Database Error: Failed to Update Payment.",
        };
    }

    // Revalidate the cache
    revalidatePath(`/dashboard/debts/${debtId}/payments`);

    // Redirect to the payments page
    redirect(`/dashboard/debts/${debtId}/payments`);
};

export { createPayment, deletePayment, updatePayment };
