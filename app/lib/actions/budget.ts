"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import {
    BudgetFormSchema,
    BudgetFormError,
    CreateBudgetFormSchema,
    IdSchema,
} from "@/app/lib/zod-schemas";
import { getAuthenticatedUserId } from "../utils/authUtils";

const createBudget = async (prevState: BudgetFormError, formData: FormData) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate form fields using Zod
    const validatedFields = CreateBudgetFormSchema.safeParse({
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

    // If the category does not exist, return an error
    if (!categoryExists) {
        return {
            errors: {
                categoryId: ["Select a valid category."],
            },
            message: "The selected category does not exist.",
        };
    }

    // Check if there is another budget with the same category on same month/year for the authenticated user
    const existingBudget = await prisma.budget.findFirst({
        where: {
            categoryId: categoryId,
            yearMonth: yearMonth,
            userId: userId,
        },
        select: {
            id: true,
        },
    });

    // If a budget with the same category and month/year already exists for the user, return an error
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
                userId: userId,
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
};

const updateBudget = async (
    budgetId: string,
    prevState: BudgetFormError,
    formData: FormData
) => {
    // Get the authenticated user's ID
    const userId = await getAuthenticatedUserId();

    // Validate form fields using Zod
    const validatedFields = BudgetFormSchema.safeParse({
        id: budgetId,
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
    const { id, categoryId, amount, yearMonth } = validatedFields.data;

    // Check if the category exists
    const categoryExists = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    // If the category does not exist, return an error
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
            userId: userId,
            // Excludes the budget with the specified id from the results.
            NOT: {
                id: id,
            },
        },
        select: {
            id: true,
        },
    });

    // If a budget with the same category and month/year already exists, return an error
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
                id: id,
                userId: userId, // Ensure the budget belongs to the authenticated user
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
};

const deleteBudget = async (id: string) => {
    // Get the authenticated user's ID
    const userId = await getAuthenticatedUserId();

    // Validate the id
    const parsedId = IdSchema.safeParse(id);

    // If ID validation fails, return an error
    if (!parsedId.success) {
        console.error("Invalid ID format:", parsedId.error);
        return {
            message: "Invalid ID format",
        };
    }

    // Extract the ID from the parsed data
    const budgetId = parsedId.data;

    try {
        // Check if the budget exists and belongs to the authenticated user
        const budget = await prisma.budget.findUnique({
            where: {
                id: budgetId,
                userId: userId,
            },
            select: {
                id: true,
            },
        });

        // If the budget does not exist or does not belong to the user, return an error
        if (!budget) {
            console.error(
                "Budget not found or user not authorized to delete it."
            );
            return {
                message: "Budget not found or user not authorized to delete it.",
            };
        }

        // Delete the budget
        await prisma.budget.delete({
            where: {
                id: budgetId,
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
};

export { createBudget, updateBudget, deleteBudget };
