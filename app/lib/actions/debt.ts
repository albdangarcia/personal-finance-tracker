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
import { getAuthenticatedUserId } from "../utils/authUtils";

const createDebt = async (prevState: DebtFormError, formData: FormData) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

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

        await prisma.debt.create({
            data: {
                name: name,
                amount: amount,
                interest: interest,
                categoryId: categoryId,
                userId: userId,
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
};

const updateDebt = async (
    debtId: string,
    prevState: DebtFormError,
    formData: FormData
) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

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

        // Check if the debt exists and belongs to the authenticated user
        const debt = await prisma.debt.findUnique({
            where: {
                id: id,
                userId: userId,
            },
        });

        // If the debt does not exist, return an error
        if (!debt) {
            return {
                message: "The debt does not exist.",
            };
        }

        // Update the debt
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
};

const deleteDebt = async (id: string) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate the id
    const parsedId = IdSchema.safeParse(id);

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
        // Check if the debt exists and belongs to the authenticated user
        const debt = await prisma.debt.findUnique({
            where: {
                id: validatedId,
                userId: userId,
            },
        });

        // If the debt does not exist or does not belong to the user, return an error
        if (!debt) {
            console.error(
                "Debt not found or user not authorized to delete it."
            );
            return {
                message: "Debt not found or user not authorized to delete it.",
            };
        }

        // Delete the debt
        await prisma.debt.delete({
            where: {
                id: validatedId,
            },
        });

        // Revalidate the cache
        revalidatePath("/dashboard/debts");
    } catch (error) {
        console.error("Failed to delete debt:", error);
        return {
            message: "Database Error: Failed to Delete Debt",
        };
    }
};

export { createDebt, updateDebt, deleteDebt };
