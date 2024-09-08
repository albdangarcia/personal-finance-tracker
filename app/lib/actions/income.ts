"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import {
    CreateIncomeFormSchema,
    IdSchema,
    IncomeFormErrors,
    IncomeFormSchema,
} from "../zod-schemas";
import { IncomeType } from "@prisma/client";
import { getAuthenticatedUserId } from "../utils/authUtils";

const createIncome = async (
    prevState: IncomeFormErrors,
    formData: FormData
) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate form fields using Zod
    const validatedFields = CreateIncomeFormSchema.safeParse({
        incomeType: formData.get("incomeType"),
        frequency: formData.get("frequency") || undefined,
        categoryId: formData.get("categoryId"),
        amount: formData.get("amount"),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate") || undefined,
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Income.",
        };
    }

    // Extract validated fields
    const { incomeType, frequency, amount, categoryId, startDate, endDate } =
        validatedFields.data;

    // Check if the income is regular and if so, extract the frequency and end date fields
    // Otherwise, set them to null
    const isRegularIncome = incomeType === IncomeType.REGULAR;
    const frequencyOptional = isRegularIncome ? frequency : null;
    const endDateOptional = isRegularIncome ? endDate : null;

    // Extract year and month from the date
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, "0"); // Ensure month is two digits

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

        // Create the income
        await prisma.income.create({
            data: {
                incomeType: incomeType,
                startDate: startDate,
                endDate: endDateOptional,
                amount: amount,
                categoryId: categoryId,
                frequency: frequencyOptional,
                yearMonth: `${year}-${month}`,
                userId: userId,
            },
        });
    } catch (error) {
        console.error("Failed to create income:", error);
        return {
            message: "Database Error: Failed to Create Income.",
        };
    }

    // Revalidate the cache
    revalidatePath("/dashboard/incomes");

    // Redirect to the incomes page
    redirect("/dashboard/incomes");
};

const deleteIncome = async (id: string) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate the ID using Zod
    const parsedId = IdSchema.safeParse(id);

    // If ID validation fails
    if (!parsedId.success) {
        console.error("Invalid ID format:", parsedId.error);
        return {
            message: "Invalid ID format.",
        };
    }

    // Extract the ID from the parsed data
    const incomeId = parsedId.data;

    try {
        // Check if the income exists and belongs to the authenticated user
        const income = await prisma.income.findUnique({
            where: {
                id: incomeId,
                userId: userId,
            },
        });

        // If the income does not exist or does not belong to the user, return an error
        if (!income) {
            console.error(
                "Income not found or user not authorized to delete it."
            );
            return {
                message:
                    "Income not found or user not authorized to delete it.",
            };
        }

        // Delete the income
        await prisma.income.delete({
            where: { id: incomeId },
        });

        // Revalidate the cache
        revalidatePath("/dashboard/debts");
    } catch (error) {
        console.error("Failed to delete Income:", error);
        return {
            message: "Database Error: Failed to Delete Income.",
        };
    }
};

const updateIncome = async (
    incomeId: string,
    prevState: IncomeFormErrors,
    formData: FormData
) => {
    // Get the authenticated user's ID
    const userId: string = await getAuthenticatedUserId();

    // Validate form fields using Zod
    const validatedFields = IncomeFormSchema.safeParse({
        id: incomeId,
        incomeType: formData.get("incomeType"),
        frequency: formData.get("frequency") || undefined,
        categoryId: formData.get("categoryId"),
        amount: formData.get("amount"),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate") || undefined,
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Income.",
        };
    }

    // Extract validated fields
    const {
        id,
        incomeType,
        frequency,
        amount,
        categoryId,
        startDate,
        endDate,
    } = validatedFields.data;

    // Extract year and month from the date
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, "0"); // Ensure month is two digits

    // Check if the income is regular and if so, extract the frequency and end date fields
    // Otherwise, set them to null
    const isRegularIncome = incomeType === IncomeType.REGULAR;
    const frequencyOptional = isRegularIncome ? frequency : null;
    const endDateOptional = isRegularIncome ? endDate : null;

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

        // Check if the income exists and belongs to the authenticated user
        const income = await prisma.income.findUnique({
            where: {
                id: id,
                userId: userId,
            },
        });

        // If the income does not exist or does not belong to the user, return an error
        if (!income) {
            console.error(
                "Income not found or user not authorized to update it."
            );
            return {
                message:
                    "Income not found or user not authorized to update it.",
            };
        }

        // Update the income
        await prisma.income.update({
            where: { id: id },
            data: {
                incomeType: incomeType,
                startDate: startDate,
                frequency: frequencyOptional,
                endDate: endDateOptional,
                amount: amount,
                yearMonth: `${year}-${month}`,
                categoryId: categoryId,
            },
        });
    } catch (error) {
        console.error("Failed to update income:", error);
        return {
            message: "Database Error: Failed to Update Income.",
        };
    }

    // Revalidate the cache
    revalidatePath("/dashboard/incomes");

    // Redirect to the incomes page
    redirect("/dashboard/incomes");
};

export { createIncome, deleteIncome, updateIncome };
