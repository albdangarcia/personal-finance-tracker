import {
    Budget,
    Category,
    Contribution,
    Debt,
    DebtPayment,
    Expense,
    Income,
    SavingsGoal,
} from "@prisma/client";

export interface CategoryInfo extends Pick<Category, "id" | "name"> {}

// budgets
interface BudgetInfo extends Pick<Budget, "id" | "amount" | "yearMonth"> {}

export interface BudgetById extends BudgetInfo {
    category: CategoryInfo;
}

export interface FilteredBudgets extends BudgetInfo {
    categoryName: string;
    totalExpenses: number;
}

// Object for the charts showing last six months of data
export interface MonthlyObject {
    monthLabel: string;
    totalAmount: number;
}

// expenses
export interface ExpenseById
    extends Pick<Expense, "id" | "name" | "amount" | "date"> {
    category: CategoryInfo;
}

export interface ExpensesByCategories {
    categoryId: string;
    categoryName: string;
    totalAmount: number;
}

// savings goals and contributions
interface ContributionInfo
    extends Pick<Contribution, "id" | "amount" | "date"> {}

interface SavingsGoalInfo extends Pick<SavingsGoal, "id" | "name" | "amount"> {}

export interface ContributionById extends ContributionInfo {
    savingsGoal: Pick<SavingsGoalInfo, "id" | "name">;
}

export interface SavingsGoalById
    extends SavingsGoalInfo,
        Pick<SavingsGoal, "categoryId"> {}

export interface GoalWithContributions extends SavingsGoalInfo {
    category: {
        name: string;
    };
    contributions: ContributionInfo[];
}

export interface CategoriesWithGoals extends CategoryInfo {
    savingsGoals: (SavingsGoalInfo & {
        contributions: Pick<ContributionInfo, "amount">[];
        totalContributions: number;
    })[];
}

// debts
interface DebtInfo extends Pick<Debt, "id" | "name" | "amount" | "interest"> {}

interface PaymentInfo extends Pick<DebtPayment, "id" | "amount" | "date"> {}

export interface DebtById extends DebtInfo, Pick<Debt, "categoryId"> {}

export interface PaymentById extends PaymentInfo {
    debt: Pick<DebtInfo, "id" | "name">;
}

export interface CategoriesWithDebts extends CategoryInfo {
    debts: (DebtInfo & {
        payments: Pick<PaymentInfo, "amount">[];
        totalPayments: number;
    })[];
}

export interface DebtWithPayments extends DebtInfo {
    payments: PaymentInfo[];
    category: Pick<Category, "name">;
}

// incomes
export interface IncomeById
    extends Omit<Income, "createdAt" | "updatedAt" | "userId" | "categoryId"> {
    category: CategoryInfo;
}

export interface GroupIncomes {
    regularIncomes: IncomeById[];
    irregularIncomes: IncomeById[];
}
