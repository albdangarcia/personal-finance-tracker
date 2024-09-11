import { string, z } from "zod";
import { Frequency, IncomeType } from "@prisma/client";

// Schema for budget form
export const BudgetFormSchema = z.object({
    id: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    categoryId: z
        .string()
        .regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
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
export interface BudgetFormError {
    errors?: {
        categoryId?: string[];
        amount?: string[];
        yearMonth?: string[];
    };
    message?: string | null;
}

// schema for expense form
export const ExpenseFormSchema = z.object({
    id: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    name: z.string().min(1),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    categoryId: z
        .string()
        .regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    date: z.coerce.date(),
});

// schema for creating a new expense, omitting the ID field
export const CreateExpenseFormSchema = ExpenseFormSchema.omit({ id: true });

// error state for expense form
export interface ExpenseFormError {
    errors?: {
        name?: string[];
        amount?: string[];
        categoryId?: string[];
        date?: string[];
    };
    message?: string | null;
}

// schema for savings form
export const SavingsGoalFormSchema = z.object({
    id: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    name: z.string().min(1),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    categoryId: z
        .string()
        .regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
});

// schema for creating a new savings goal, omitting the ID field
export const CreateSavingsGoalFormSchema = SavingsGoalFormSchema.omit({
    id: true,
});

// error state for savings form
export interface SavingsGoalFormError {
    errors?: {
        name?: string[];
        amount?: string[];
        categoryId?: string[];
    };
    message?: string | null;
}

// Schema for contribution form
export const ContributionFormSchema = z.object({
    id: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    date: z.coerce.date(),
});

// Schema for creating a new contribution, omitting the ID field
export const CreateContributionFormSchema = ContributionFormSchema.omit({
    id: true,
});

// error interface for contribution form
export interface ContributionFormError {
    errors?: {
        amount?: string[];
        date?: string[];
    };
    message?: string | null;
}

// Schema for debt form
export const DebtFormSchema = z.object({
    id: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    name: z.string().min(1),
    categoryId: z
        .string()
        .regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
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
export interface DebtFormError {
    errors?: {
        name?: string[];
        categoryId?: string[];
        amount?: string[];
        interest?: string[];
    };
    message?: string | null;
}

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
export interface PaymentFormError {
    errors?: {
        amount?: string[];
        date?: string[];
    };
    message?: string | null;
}

// Schema for the income form
export const IncomeFormSchema = z.object({
    id: z.string().regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    categoryId: z
        .string()
        .regex(/^c[^\s-]{8,}$/i, { message: "Invalid CUID format." }),
    frequency: z.nativeEnum(Frequency).optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    incomeType: z.nativeEnum(IncomeType),
});

// Error interface for the income form
export interface IncomeFormErrors {
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

// Login form errors
export interface LoginFormErrors {
    errors?: {
        email?: string[];
        password?: string[];
    };
    message?: string | null;
}

// Schema for the login form
export const SignInSchema = z.object({
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
});

// Sign up form errors
export interface SignupFormErrors {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string | null;
}

// Schema for the login form
export const SignupSchema = z.object({
    name: string({ required_error: "Name is required" }).min(1, "Name is required"),
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
});

// Schema for the query parameter
export const QuerySchema = z.string().max(100).optional();

// Define a schema for year
const yearSchema = z.string().regex(/^\d{4}$/, "Year must be a four-digit number");

// Define a schema for month
const monthSchema = z.string().regex(/^(0[1-9]|1[0-2])$/, "Month must be a two-digit number between 01 and 12");

// Combine schemas into a single schema
export const YearMonthSchema = z.object({
    year: yearSchema,
    month: monthSchema,
});

// schema for yearMonth
export const InputYearMonthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: "Please enter a valid yearMonth in the format YYYY-MM.",
});

// schema for provider login
export interface ProviderFormErrors {
    errors?: {
        providerId?: string[];
    };
    message?: string | null;
}
export const ProviderLoginSchema = z.object({
    providerId: z
        .string()
        .min(1, "Provider ID is required")
        .max(100, "Provider ID must be less than 100 characters"),
});