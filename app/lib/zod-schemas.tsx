import { z } from "zod";

// error state for budget form
export type BudgetFormErrorState = {
    errors?: {
        categoryId?: string[];
        amount?: string[];
        yearMonth?: string[];
    };
    message?: string | null;
};

// schema for budget form
export const BudgetSchema = z.object({
    categoryId: z.string().min(1),
    yearMonth: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
        message: "Please enter a valid yearMonth in the format YYYY-MM.",
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
});

// schema for expense form
export const ExpenseSchema = z.object({
    name: z.string().min(1),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    categoryId: z.string().min(1),
    date: z.coerce.date(),
});

// error state for expense form
export type ExpenseFormErrorState = {
    errors?: {
        name?: string[];
        amount?: string[];
        categoryId?: string[];
        date?: string[];
    };
    message?: string | null;
};

// schema for savings form
export const SavingsGoalSchema = z.object({
    name: z.string().min(1),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    categoryId: z.string().min(1),
});

// error state for savings form
export type SavingsGoalFormErrorState = {
    errors?: {
        name?: string[];
        amount?: string[];
        categoryId?: string[];
    };
    message?: string | null;
};

// schema for contribution form
export const ContributionSchema = z.object({
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    date: z.coerce.date(),
});

// error state for contribution form
export type ContributionFormErrorState = {
    errors?: {
        amount?: string[];
        date?: string[];
    };
    message?: string | null;
};

// schema for yearMonth
export const YearMonthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: "Please enter a valid yearMonth in the format YYYY-MM.",
});
