"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { ContributionFormErrorState, ContributionSchema } from "../zod-schemas";

export async function deleteContribution(id: string) {
    try {
        await prisma.contribution.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error("Failed to delete Contribution:", error);
        throw new Error("Failed to delete Contribution");
    }
    // Revalidate the cache
    revalidatePath("/dashboard/contributions");
    // Redirect the user
    redirect("/dashboard/contributions");
}

export async function createContribution(
    savingsGoalId: string,
    prevState: ContributionFormErrorState,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = ContributionSchema.safeParse({
        amount: formData.get("amount"),
        date: formData.get("date"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Contribution.",
        };
    }

    // Extract validated fields
    const { amount, date } = validatedFields.data;

    // Create the contribution
    try {
        await prisma.contribution.create({
            data: {
                amount: Number(amount),
                date: new Date(date.toString()),
                savingsGoalId: savingsGoalId,
            },
        });
    } catch (error) {
        console.error("Failed to create Contribution:", error);
        return {
            message: "Database Error: Failed to Create Contribution.",
        };
    }

    // Revalidate the cache
    revalidatePath(`/dashboard/savings-goals/${savingsGoalId}/contributions`);

    // Redirect the user
    redirect(`/dashboard/savings-goals/${savingsGoalId}/contributions`);
}

export async function updateContribution(
    id: string,
    goalId: string,
    prevState: ContributionFormErrorState,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = ContributionSchema.safeParse({
        amount: formData.get("amount"),
        date: formData.get("date"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Contribution.",
        };
    }

    // Extract validated fields
    const { amount, date } = validatedFields.data;

    // Update the contribution
    try {
        await prisma.contribution.update({
            where: {
                id: id,
            },
            data: {
                amount: Number(amount),
                date: new Date(date.toString()),
            },
        });
    } catch (error) {
        console.error("Failed to update Contribution:", error);
        return {
            message: "Database Error: Failed to Update Contribution.",
        };
    }

    // Revalidate the cache
    revalidatePath(`/dashboard/savings-goals/${goalId}/contributions`);

    // Redirect the user
    redirect(`/dashboard/savings-goals/${goalId}/contributions`);
}