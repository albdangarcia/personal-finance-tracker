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

const createIncome = async (
    prevState: IncomeFormErrors,
    formData: FormData
) => {
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

    const isRegularIncome = incomeType === IncomeType.REGULAR;
    const frequencyOptional = isRegularIncome ? frequency : null;
    const endDateOptional = isRegularIncome ? endDate : null;

    // Extract year and month from the date
    // const year = startDate.getFullYear();
    // const month = String(startDate.getMonth() + 1).padStart(2, "0"); // Ensure month is two digits
    // const yearMonth = `${year}-${month}`;

    try {
        // Create the income
        await prisma.income.create({
            data: {
                incomeType: incomeType,
                startDate: startDate,
                endDate: endDateOptional,
                amount: amount,
                categoryId: categoryId,
                frequency: frequencyOptional,
                yearMonth: "2024-08",
                userId: "clziqqbgy000108l7dmts0vng",
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
    // Validate the ID using Zod
    const parsedId = IdSchema.safeParse(id);

    // If ID validation fails, throw an error
    if (!parsedId.success) {
        console.error("Invalid ID format:", parsedId.error);
        throw new Error("Invalid ID format");
    }

    // Extract the ID from the parsed data
    const incomeId = parsedId.data;

    try {
        await prisma.income.delete({
            where: { id: incomeId },
        });

        // Revalidate the cache
        revalidatePath("/dashboard/debts");
    } catch (error) {
        console.error("Failed to delete Income:", error);
        throw new Error("Failed to delete Income");
    }
};

const updateIncome = async (
    incomeId: string,
    prevState: IncomeFormErrors,
    formData: FormData
) => {
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

    const isRegularIncome = incomeType === IncomeType.REGULAR;
    const frequencyOptional = isRegularIncome ? frequency : null;
    const endDateOptional = isRegularIncome ? endDate : null;

    try {
        // Update the income
        await prisma.income.update({
            where: { id: id },
            data: {
                incomeType: incomeType,
                startDate: startDate,
                frequency: frequencyOptional,
                endDate: endDateOptional,
                amount: amount,
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
