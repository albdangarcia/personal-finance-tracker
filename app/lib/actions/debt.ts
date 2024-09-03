"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import {
    CreateDebtFormSchema,
    DebtFormError,
    DebtFormSchema,
    IdSchema,
} from "../zod-schemas";

export async function createDebt(prevState: DebtFormError, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateDebtFormSchema.safeParse({
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
    debtId: string,
    prevState: DebtFormError,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = DebtFormSchema.safeParse({
        id: debtId,
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
    const { id, name, amount, interest, categoryId } = validatedFields.data;

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
                categoryId: categoryId,
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
    // Validate the id
    const parsedId = IdSchema.safeParse(id);

    // If ID validation fails, throw an error
    if (!parsedId.success) {
        console.error("Invalid ID format:", parsedId.error);
        throw new Error("Invalid ID format");
    }

    // Extract the validated ID
    const validatedId = parsedId.data;

    try {
        await prisma.debt.delete({
            where: {
                id: validatedId,
            },
        });

        // Revalidate the cache
        revalidatePath("/dashboard/debts");
    } catch (error) {
        console.error("Failed to delete debt:", error);
        throw new Error("Failed to delete debt");
    }
}
