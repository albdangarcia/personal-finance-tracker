"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { BudgetSchema, BudgetFormErrorState } from "@/app/lib/zod-schemas";

export async function createBudget(
  prevState: BudgetFormErrorState,
  formData: FormData
) {
  
  // Validate form fields using Zod
  const validatedFields = BudgetSchema.safeParse({
    frequency: formData.get("frequency"),
    allocation: formData.get("allocation"),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Budget.",
    };
  }

  // Extract validated fields
  const { frequency, allocation } = validatedFields.data;

  try {
    await prisma.budget.create({
      data: {
        frequency: frequency,
        allocation: allocation,
      },
    });
  } catch (error) {
    console.error("Failed to create Budget:", error);
    return {
      message: "Database Error: Failed to Create Budget.",
    };
  }
  // Revalidate the cache
  revalidatePath('/dashboard/budgets');
  // Redirect the user
  redirect('/dashboard/budgets');
}
