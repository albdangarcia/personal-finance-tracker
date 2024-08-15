"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { BudgetSchema, BudgetFormErrorState } from "@/app/lib/zod-schemas";

export async function createBudget(
    prevState: BudgetFormErrorState,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = BudgetSchema.safeParse({
        categoryId: formData.get("categoryId"),
        amount: formData.get("amount"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Budget.",
        };
    }

    // Extract validated fields
    const { categoryId, amount } = validatedFields.data;

    // Create the budget
    try {
        await prisma.budget.create({
            data: {
                categoryId: categoryId,
                amount: amount,
                userId: "clziqqbgy000108l7dmts0vng",
            },
        });
    } catch (error) {
        console.error("Failed to create Budget:", error);
        return {
            message: "Database Error: Failed to Create Budget.",
        };
    }
    // Revalidate the cache
    revalidatePath("/dashboard/budgets");
    // Redirect the user
    redirect("/dashboard/budgets");
}

export async function updateBudget(
    id: string,
    prevState: BudgetFormErrorState,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = BudgetSchema.safeParse({
        categoryId: formData.get("category"),
        amount: formData.get("amount"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Edit Budget.",
        };
    }

    // Extract validated fields
    const { categoryId, amount } = validatedFields.data;

    // Check if the category exists
    if (categoryId) {
        const categoryExists = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        });
        if (!categoryExists) {
            throw new Error("Category ID does not exist");
        }
    }

    // Update the budget
    try {
        await prisma.budget.update({
            where: {
                id: id,
            },
            data: {
                categoryId: categoryId,
                amount: amount,
            },
        });
    } catch (error) {
        console.error("Failed to update Budget:", error);
        return {
            message: "Database Error: Failed to Edit Budget.",
        };
    }
    // Revalidate the cache
    revalidatePath("/dashboard/budgets");
    // Redirect the user
    redirect("/dashboard/budgets");
}

export async function deleteBudget(id: string) {
    // Delete the budget
    try {
        await prisma.budget.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error("Failed to delete Budget:", error);
        return {
            message: "Database Error: Failed to Delete Budget.",
        };
    }
    // Revalidate the cache
    revalidatePath("/dashboard/budgets");
    // Redirect the user
    redirect("/dashboard/budgets");
}
