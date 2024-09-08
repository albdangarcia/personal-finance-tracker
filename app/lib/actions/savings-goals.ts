"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import {
    CreateSavingsGoalFormSchema,
    IdSchema,
    SavingsGoalFormError,
    SavingsGoalFormSchema,
} from "../zod-schemas";
import { getAuthenticatedUserId } from "../utils/authUtils";

const deleteSavingsGoal = async (id: string) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate the id
    const parsedId = IdSchema.safeParse(id);

    // If ID validation fails
    if (!parsedId.success) {
        console.error("Invalid ID format:", parsedId.error);
        return {
            message: "Invalid ID format.",
        };
    }

    // Extract the validated ID
    const validatedId = parsedId.data;

    try {
        // Check if the savings goal exists and belongs to the authenticated user
        const savingsGoal = await prisma.savingsGoal.findUnique({
            where: {
                id: validatedId,
                userId: userId,
            },
        });

        // If the savings goal does not exist or does not belong to the user, return an error
        if (!savingsGoal) {
            console.error(
                "Savings Goal not found or user not authorized to delete it."
            );
            return {
                message:
                    "Savings Goal not found or user not authorized to delete it.",
            };
        }

        // Delete the savings goal
        await prisma.savingsGoal.delete({
            where: {
                id: validatedId,
            },
        });

        // Revalidate the path
        revalidatePath("/dashboard/savings-goals");
    } catch (error) {
        console.error("Failed to delete saving goal:", error);
        return {
            message: "Database Error: Failed to Delete Savings Goal.",
        };
    }
};

const createSavingsGoal = async (
    prevState: SavingsGoalFormError,
    formData: FormData
) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate form fields using Zod
    const validatedFields = CreateSavingsGoalFormSchema.safeParse({
        name: formData.get("name"),
        amount: formData.get("amount"),
        categoryId: formData.get("categoryId"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Savings Goal.",
        };
    }

    // Extract validated fields
    const { name, amount, categoryId } = validatedFields.data;

    // Create the savings goal
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

        // Create the savings goal
        await prisma.savingsGoal.create({
            data: {
                name: name,
                amount: amount,
                categoryId: categoryId,
                userId: userId,
            },
        });
    } catch (error) {
        console.error("Failed to create Savings Goal:", error);
        return {
            message: "Database Error: Failed to Create Savings Goal.",
        };
    }

    // Revalidate the cache
    revalidatePath("/dashboard/savings-goals");

    // Redirect the user
    redirect("/dashboard/savings-goals");
};

const updateSavingsGoals = async (
    GoalId: string,
    prevState: SavingsGoalFormError,
    formData: FormData
) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate form fields using Zod
    const validatedFields = SavingsGoalFormSchema.safeParse({
        id: GoalId,
        name: formData.get("name"),
        amount: formData.get("amount"),
        categoryId: formData.get("categoryId"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Savings Goal.",
        };
    }

    // Extract validated fields
    const { id, name, amount, categoryId } = validatedFields.data;

    // Update the savings goal
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

        // Check if the savings goal exists and belongs to the authenticated user
        const savingsGoal = await prisma.savingsGoal.findUnique({
            where: {
                id: id,
                userId: userId,
            },
        });

        // If the savings goal does not exist or does not belong to the user, return an error
        if (!savingsGoal) {
            console.error(
                "Savings Goal not found or user not authorized to update it."
            );
            return {
                message:
                    "Savings Goal not found or user not authorized to update it.",
            };
        }

        // Update the savings goal
        await prisma.savingsGoal.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                amount: amount,
                categoryId: categoryId,
            },
        });
    } catch (error) {
        console.error("Failed to update Savings Goal:", error);
        return {
            message: "Database Error: Failed to Update Savings Goal.",
        };
    }
    // Revalidate the cache
    revalidatePath("/dashboard/savings-goals");

    // Redirect the user
    redirect("/dashboard/savings-goals");
};

export { deleteSavingsGoal, createSavingsGoal, updateSavingsGoals };
