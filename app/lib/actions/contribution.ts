"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import {
    ContributionFormError,
    ContributionFormSchema,
    CreateContributionFormSchema,
    IdSchema,
} from "../zod-schemas";

export async function deleteContribution(id: string, savingsGoalId: string) {
    // Validate the ID using Zod
    const parsedId = IdSchema.safeParse(id);

    // If ID validation fails, throw an error
    if (!parsedId.success) {
        console.error("Invalid ID format:", parsedId.error);
        throw new Error("Invalid ID format");
    }

    // Extract the ID from the validated data
    const contributionId = parsedId.data;

    try {
        await prisma.contribution.delete({
            where: {
                id: contributionId,
            },
        });
    } catch (error) {
        console.error("Failed to delete Contribution:", error);
        throw new Error("Failed to delete Contribution");
    }

    // Revalidate the cache
    revalidatePath(`/dashboard/savings-goals/${savingsGoalId}/contributions`);
}

export async function createContribution(
    savingsGoalId: string,
    prevState: ContributionFormError,
    formData: FormData
) {
    // Validate the id
    const parsedId = IdSchema.safeParse(savingsGoalId);

    // If ID validation fails, throw an error
    if (!parsedId.success) {
        console.error("Invalid ID format:", parsedId.error);
        throw new Error("Invalid ID format");
    }

    // Extract the ID from the parsed data
    const validatedGoalId = parsedId.data;

    // Validate form fields using Zod
    const validatedFields = CreateContributionFormSchema.safeParse({
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
                savingsGoalId: validatedGoalId,
            },
        });
    } catch (error) {
        console.error("Failed to create Contribution:", error);
        return {
            message: "Database Error: Failed to Create Contribution.",
        };
    }

    // Revalidate the cache
    revalidatePath(`/dashboard/savings-goals/${validatedGoalId}/contributions`);

    // Redirect the user
    redirect(`/dashboard/savings-goals/${validatedGoalId}/contributions`);
}

export async function updateContribution(
    contributionId: string,
    goalId: string,
    prevState: ContributionFormError,
    formData: FormData
) {
    // Validate form fields using Zod
    const validatedFields = ContributionFormSchema.safeParse({
        id: contributionId,
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
    const { id, amount, date } = validatedFields.data;

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