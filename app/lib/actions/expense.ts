"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import {
    CreateExpenseFormSchema,
    ExpenseFormError,
    ExpenseFormSchema,
    IdSchema,
} from "../zod-schemas";
import { getAuthenticatedUserId } from "../utils/authUtils";

const deleteExpense = async (expenseId: string) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate the id
    const parsedId = IdSchema.safeParse(expenseId);

    // If ID validation fails
    if (!parsedId.success) {
        console.error("Invalid ID format:", parsedId.error);
        return {
            message: "Invalid ID format",
        };
    }

    // Extract the validated ID
    const validatedId = parsedId.data;

    try {
        // Check if the expense exists and belongs to the authenticated user
        const expense = await prisma.expense.findUnique({
            where: {
                id: validatedId,
                userId: userId,
            },
        });

        // If the expense does not exist or does not belong to the user, return an error
        if (!expense) {
            console.error(
                "Expense not found or user not authorized to delete it."
            );
            return {
                message:
                    "Expense not found or user not authorized to delete it.",
            };
        }

        // Delete the expense
        await prisma.expense.delete({
            where: {
                id: validatedId,
            },
        });
    } catch (error) {
        console.error("Failed to delete expense:", error);
        return {
            message: "Database Error: Failed to Delete Expense",
        };
    }

    // Revalidate the cache
    revalidatePath("/dashboard/expenses");

    // Redirect the user
    redirect("/dashboard/expenses");
};

const createExpense = async (
    prevState: ExpenseFormError,
    formData: FormData
) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate form fields using Zod
    const validatedFields = CreateExpenseFormSchema.safeParse({
        name: formData.get("name"),
        amount: formData.get("amount"),
        categoryId: formData.get("categoryId"),
        date: formData.get("date"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Expense.",
        };
    }

    // Extract validated fields
    const { name, amount, categoryId, date } = validatedFields.data;

    // Extract year and month from the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure month is two digits
    const yearMonth = `${year}-${month}`;

    try {
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

        await prisma.expense.create({
            data: {
                name: name,
                amount: amount,
                categoryId: categoryId,
                date: date,
                yearMonth: yearMonth,
                userId: userId,
            },
        });
    } catch (error) {
        console.error("Failed to create Expense:", error);
        return {
            message: "Database Error: Failed to Create Expense.",
        };
    }

    // Revalidate the cache
    revalidatePath("/dashboard/expenses");

    // Redirect the user
    redirect("/dashboard/expenses");
};

const updateExpense = async (
    updateId: string,
    prevState: ExpenseFormError,
    formData: FormData
) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate form fields using Zod
    const validatedFields = ExpenseFormSchema.safeParse({
        id: updateId,
        name: formData.get("name"),
        amount: formData.get("amount"),
        categoryId: formData.get("categoryId"),
        date: formData.get("date"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Expense.",
        };
    }

    // Extract validated fields
    const { id, name, amount, categoryId, date } = validatedFields.data;

    // Update the expense
    try {
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

        // check if the expense exists and belongs to the authenticated user
        const expense = await prisma.expense.findUnique({
            where: {
                id: id,
                userId: userId,
            },
        });
        
        // If the expense does not exist or does not belong to the user, return an error
        if (!expense) {
            return {
                message: "Expense not found or user not authorized to update it.",
            };
        }

        // Update the expense
        await prisma.expense.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                amount: amount,
                categoryId: categoryId,
                date: date,
            },
        });
    } catch (error) {
        console.error("Failed to update Expense:", error);
        return {
            message: "Database Error: Failed to Update Expense.",
        };
    }

    // Revalidate the cache
    revalidatePath("/dashboard/expenses");

    // Redirect the user
    redirect("/dashboard/expenses");
};

export { createExpense, updateExpense, deleteExpense };
