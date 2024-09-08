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
import { getAuthenticatedUserId } from "../utils/authUtils";

const deleteContribution = async (id: string, savingsGoalId: string) => {
    // Get the authenticated user's ID
    const userId = await getAuthenticatedUserId();

    // Validate the contribution ID using Zod
    const parsedId = IdSchema.safeParse(id);

    // If ID validation fails
    if (!parsedId.success) {
        console.error("Invalid ID format:", parsedId.error);
        return {
            message: "Invalid ID format",
        };
    }

    // Extract the ID from the validated data
    const contributionId = parsedId.data;

    try {
        // Fetch the Contribution along with the userId of its related SavingsGoal
        const contribution = await prisma.contribution.findUnique({
            where: { id: contributionId },
            select: {
                savingsGoal: {
                    select: {
                        userId: true,
                    },
                },
            },
        });

        // Check if the contribution exists
        if (!contribution) {
            return {
                message: "Contribution not found",
            };
        }

        // Check if the user owns the contribution
        if (contribution.savingsGoal.userId !== userId) {
            return {
                message: "You do not have permission to delete this contribution",
            };
        }

        // Proceed to delete the contribution
        await prisma.contribution.delete({
            where: { id: contributionId },
        });
    } catch (error) {
        console.error("Failed to delete Contribution:", error);
        return {
            message: "Database Error: Failed to Delete Contribution.",
        };
    }

    // Revalidate the cache
    revalidatePath(`/dashboard/savings-goals/${savingsGoalId}/contributions`);
};

const createContribution = async (
    savingsGoalId: string,
    prevState: ContributionFormError,
    formData: FormData
) => {
    // Get the authenticated user's ID
    const userId = await getAuthenticatedUserId();

    // Validate the savingsGoalId id
    const parsedId = IdSchema.safeParse(savingsGoalId);

    // If ID validation fails,
    if (!parsedId.success) {
        console.error("Invalid ID format:", parsedId.error);
        return {
            message: "Invalid ID format",
        };
    }

    // Extract the ID from the parsed data
    const validatedGoalId = parsedId.data;

    // Verify that the savings goal belongs to the authenticated user
    const savingsGoal = await prisma.savingsGoal.findUnique({
        where: { id: validatedGoalId, userId: userId },
        select: { id: true },
    });

    // If the savings goal does not exist
    if (!savingsGoal) {
        return {
            message: "Unauthorized access to savings goal",
        };
    }

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
};

const updateContribution = async (
    contributionId: string,
    goalId: string,
    prevState: ContributionFormError,
    formData: FormData
) => {
    // Get the authenticated user's ID
    const userId = await getAuthenticatedUserId();

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
        // Fetch the Contribution along with the userId of its related SavingsGoal
        const contribution = await prisma.contribution.findUnique({
            where: { id: contributionId },
            select: {
                savingsGoal: {
                    select: {
                        userId: true,
                    },
                },
            },
        });

        // Check if the contribution exists
        if (!contribution) {
            return {
                message: "Contribution not found",
            };
        }

        // Check if the user owns the contribution
        if (contribution.savingsGoal.userId !== userId) {
            return {
                message: "You do not have permission to update this contribution",
            };
        }

        // Proceed to update the contribution
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
};

export { createContribution, deleteContribution, updateContribution };
