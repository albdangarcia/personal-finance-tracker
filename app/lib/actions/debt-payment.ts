"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { PaymentFormErrorState, PaymentSchema } from "../zod-schemas";

export async function deletePayment(id: string, debtId: string) {
    try {
        await prisma.debtPayment.delete({
            where: {
                id: id,
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
    prevState: PaymentFormErrorState,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = PaymentSchema.safeParse({
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

    // Create the payment
    try {
        await prisma.debtPayment.create({
            data: {
                amount: Number(amount),
                date: new Date(date.toString()),
                debtId: debtId,
            },
        });
    } catch (error) {
        console.error("Failed to create Payment:", error);
        return {
            message: "Database Error: Failed to Create Payment.",
        };
    }

    // Revalidate the cache
    revalidatePath(`/dashboard/debts/${debtId}/payments`);
   
    // Redirect to the payments page
    redirect(`/dashboard/debts/${debtId}/payments`);
}

export async function updatePayment(
    id: string,
    debtId: string,
    prevState: PaymentFormErrorState,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = PaymentSchema.safeParse({
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
    const { amount, date } = validatedFields.data;

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