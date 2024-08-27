"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { ExpenseFormErrorState, ExpenseSchema } from "../zod-schemas";

export async function deleteExpense(expenseId: string) {
    try {
        await prisma.expense.delete({
            where: {
                id: expenseId,
            },
        });
    } catch (error) {
        console.error("Failed to delete expense:", error);
        throw new Error("Failed to delete expense");
    }

    // Revalidate the cache
    revalidatePath("/dashboard/expenses");

    // Redirect the user
    redirect("/dashboard/expenses");
}

export async function createExpense(
    prevState: ExpenseFormErrorState,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = ExpenseSchema.safeParse({
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

    // Create the expense
    try {
        await prisma.expense.create({
            data: {
                name: name,
                amount: amount,
                categoryId: categoryId,
                date: date,
                yearMonth: yearMonth,
                userId: "clziqqbgy000108l7dmts0vng",
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
}

export async function updateExpense(
    id: string,
    prevState: ExpenseFormErrorState,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = ExpenseSchema.safeParse({
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
    const { name, amount, categoryId, date } = validatedFields.data;

    // Update the expense
    try {
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
}
