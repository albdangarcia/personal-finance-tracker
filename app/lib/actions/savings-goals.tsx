"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { SavingsGoalFormErrorState, SavingsGoalSchema } from "../zod-schemas";

export async function deleteSavingsGoal(id: string) {
    // Delete the saving goal
    try {
        await prisma.savingsGoal.delete({
            where: {
                id,
            },
        });
        // Revalidate the path
        revalidatePath("/dashboard/savings-goals");
        redirect("/dashboard/savings-goals");
    } catch (error) {
        console.error("Failed to delete saving goal:", error);
        throw new Error("Failed to delete saving goal.");
    }
}

export async function createSavingsGoal(
    prevState: SavingsGoalFormErrorState,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = SavingsGoalSchema.safeParse({
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
        await prisma.savingsGoal.create({
            data: {
                name: name,
                amount: amount,
                categoryId: categoryId,
                userId: "clziqqbgy000108l7dmts0vng",
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
}

export async function updateSavingsGoals(
    id: string,
    prevState: SavingsGoalFormErrorState,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = SavingsGoalSchema.safeParse({
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
    const { name, amount, categoryId } = validatedFields.data;

    // Update the savings goal
    try {
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
}
