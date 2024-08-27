"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { DebtFormErrorState, DebtSchema } from "../zod-schemas";

export async function createDebt(
    prevState: DebtFormErrorState,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = DebtSchema.safeParse({
        name: formData.get("name"),
        amount: formData.get("amount"),
        interest: formData.get("interest"),
        categoryId: formData.get("categoryId"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Debt.",
        };
    }

    // Extract validated fields
    const { name, amount, interest, categoryId } = validatedFields.data;

    // Create the debt
    try {
        await prisma.debt.create({
            data: {
                name: name,
                amount: amount,
                interest: interest,
                categoryId: categoryId,
                userId: "clziqqbgy000108l7dmts0vng",
            },
        });
    } catch (error) {
        console.error("Failed to create debt:", error);
        return {
            message: "Database Error: Failed to Create Debt.",
        };
    }
    
    // Revalidate the cache
    revalidatePath("/dashboard/debts");

    // Redirect to the debts page
    redirect("/dashboard/debts");
}

export async function updateDebt(
    id: string,
    prevState: DebtFormErrorState,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = DebtSchema.safeParse({
        name: formData.get("name"),
        amount: formData.get("amount"),
        interest: formData.get("interest"),
        categoryId: formData.get("categoryId"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Debt.",
        };
    }

    // Extract validated fields
    const { name, amount, interest, categoryId } = validatedFields.data;

    // Update the debt
    try {
        await prisma.debt.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                amount: amount,
                interest: interest,
                categoryId: categoryId
            },
        });
    } catch (error) {
        console.error("Failed to update debt:", error);
        return {
            message: "Database Error: Failed to Update Debt.",
        };
    }

    // Revalidate the cache
    revalidatePath("/dashboard/debts");

    // Redirect to the debts page
    redirect("/dashboard/debts");
}

export async function deleteDebt(id: string) {
    try {
        await prisma.debt.delete({
            where: {
                id,
            },
        });

        revalidatePath("/dashboard/debts");
    } catch (error) {
        console.error("Failed to delete debt:", error);
        throw new Error("Failed to delete debt");
    }
}