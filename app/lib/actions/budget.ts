"use server";
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
        yearMonth: formData.get("yearMonth"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Budget.",
        };
    }

    // Extract validated fields
    const { categoryId, amount, yearMonth } = validatedFields.data;

    // Check if the category exists
    const categoryExists = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    if (!categoryExists) {
        return {
            errors: {
                categoryId: ["Select a valid category."],
            },
            message: "The selected category does not exist.",
        };
    }

    // Check if there is another budget with the same category on same month/year
    const existingBudget = await prisma.budget.findFirst({
        where: {
            categoryId: categoryId,
            yearMonth: yearMonth,
        },
    });

    if (existingBudget) {
        return {
            errors: {
                categoryId: ["Select a different category."],
            },
            message:
                "A budget with the same category and month/year already exists.",
        };
    }

    // Create the budget
    try {
        await prisma.budget.create({
            data: {
                categoryId: categoryId,
                amount: amount,
                yearMonth: yearMonth,
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
    budgetId: string,
    prevState: BudgetFormErrorState,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = BudgetSchema.safeParse({
        categoryId: formData.get("categoryId"),
        amount: formData.get("amount"),
        yearMonth: formData.get("yearMonth"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Edit Budget.",
        };
    }

    // Extract validated fields
    const { categoryId, amount, yearMonth } = validatedFields.data;

    // Check if the category exists
    const categoryExists = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    if (!categoryExists) {
        return {
            errors: {
                categoryId: ["Select a valid category."],
            },
            message: "The selected category does not exist.",
        };
    }

    // Check if there is another budget with the same category on same month/year
    const existingBudget = await prisma.budget.findFirst({
        where: {
            categoryId: categoryId,
            yearMonth: yearMonth,
            // Excludes the budget with the specified id from the results.
            NOT: {
                id: budgetId,
            },
        },
    });

    if (existingBudget) {
        return {
            errors: {
                categoryId: ["Select a different category."],
            },
            message:
                "A budget with the same category and month/year already exists.",
        };
    }

    // Update the budget
    try {
        await prisma.budget.update({
            where: {
                id: budgetId,
            },
            data: {
                categoryId: categoryId,
                amount: amount,
                yearMonth: yearMonth,
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
