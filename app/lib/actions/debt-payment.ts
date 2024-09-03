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

export async function deletePayment(id: string, debtId: string) {
    // Validate the id
    const parsedPaymentId = IdSchema.safeParse(id);

    // If ID validation fails, throw an error
    if (!parsedPaymentId.success) {
        console.error("Invalid ID format:", parsedPaymentId.error);
        throw new Error("Invalid ID format");
    }

    // Extract the ID from the validated data
    const validatedPaymentId = parsedPaymentId.data;

    try {
        await prisma.debtPayment.delete({
            where: {
                id: validatedPaymentId,
            },
        });
    } catch (error) {
        console.error("Failed to delete Debt:", error);
        throw new Error("Failed to delete Debt");
    }
    // Revalidate the cache
    revalidatePath(`/dashboard/debts/${debtId}/payments`);
}

export async function createPayment(
    debtId: string,
    prevState: PaymentFormError,
    formData: FormData
) {
    const parsedDebtId = IdSchema.safeParse(debtId);

    // If ID validation fails, throw an error
    if (!parsedDebtId.success) {
        console.error("Invalid ID format:", parsedDebtId.error);
        throw new Error("Invalid ID format");
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
}

export async function updatePayment(
    paymentId: string,
    debtId: string,
    prevState: PaymentFormError,
    formData: FormData
) {
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
}
