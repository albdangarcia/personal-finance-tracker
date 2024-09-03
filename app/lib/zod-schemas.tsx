import { z } from "zod";
import { Frequency, IncomeType } from "@prisma/client";

// Schema for budget form
export const BudgetFormSchema = z.object({
    id: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    categoryId: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    yearMonth: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
        message: "Please enter a valid yearMonth in the format YYYY-MM.",
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
});

// Schema for creating a new budget, omitting the ID field
export const CreateBudgetFormSchema = BudgetFormSchema.omit({ id: true });

// Error interface for budget form
export type BudgetFormError = {
    errors?: {
        categoryId?: string[];
        amount?: string[];
        yearMonth?: string[];
    };
    message?: string | null;
};

// schema for expense form
export const ExpenseFormSchema = z.object({
    id: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    name: z.string().min(1),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    categoryId: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    date: z.coerce.date(),
});

// schema for creating a new expense, omitting the ID field
export const CreateExpenseFormSchema = ExpenseFormSchema.omit({ id: true });

// error state for expense form
export type ExpenseFormError = {
    errors?: {
        name?: string[];
        amount?: string[];
        categoryId?: string[];
        date?: string[];
    };
    message?: string | null;
};

// schema for savings form
export const SavingsGoalFormSchema = z.object({
    id: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    name: z.string().min(1),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    categoryId: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
});

// schema for creating a new savings goal, omitting the ID field
export const CreateSavingsGoalFormSchema = SavingsGoalFormSchema.omit({ id: true });

// error state for savings form
export type SavingsGoalFormError = {
    errors?: {
        name?: string[];
        amount?: string[];
        categoryId?: string[];
    };
    message?: string | null;
};

// Schema for contribution form
export const ContributionFormSchema = z.object({
    id: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    date: z.coerce.date(),
});

// Schema for creating a new contribution, omitting the ID field
export const CreateContributionFormSchema = ContributionFormSchema.omit({ id: true });

// error interface for contribution form
export type ContributionFormError = {
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

// Schema for debt form
export const DebtFormSchema = z.object({
    id: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    name: z.string().min(1),
    categoryId: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    interest: z.coerce
        .number()
        .gte(0, { message: "Please enter an interest rate of 0 or greater." }),
});

// Schema for creating a new debt, omitting the ID field
export const CreateDebtFormSchema = DebtFormSchema.omit({ id: true });

// Error interface for the debt form
export type DebtFormError = {
    errors?: {
        name?: string[];
        categoryId?: string[];
        amount?: string[];
        interest?: string[];
    };
    message?: string | null;
};


// Schema for the payment form
export const PaymentFormSchema = z.object({
    id: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    date: z.coerce.date(),
});

// Schema for creating a new payment, omitting the ID field
export const CreatePaymentFormSchema = PaymentFormSchema.omit({ id: true });

// Error interface for the payment form
export type PaymentFormError = {
    errors?: {
        amount?: string[];
        date?: string[];
    };
    message?: string | null;
};

// Schema for the income form
export const IncomeFormSchema = z.object({
    id: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    categoryId: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    frequency: z.nativeEnum(Frequency).optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    incomeType: z.nativeEnum(IncomeType),
});

// Error interface for the income form
export type IncomeFormErrors = {
    errors?: {
        amount?: string[];
        categoryId?: string[];
        frequency?: string[];
        startDate?: string[];
        endDate?: string[];
        incomeType?: string[];
    };
    message?: string | null;
}

// Schema for creating a new income, omitting the ID field
export const CreateIncomeFormSchema = IncomeFormSchema.omit({ id: true });

// Schema for ids
export const IdSchema = z.string().regex(/^c[^\s-]{8,}$/i);
