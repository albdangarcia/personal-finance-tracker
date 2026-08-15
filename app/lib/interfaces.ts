import type {
  BudgetModel,
  CategoryModel,
  ContributionModel,
  DebtModel,
  DebtPaymentModel,
  ExpenseModel,
  IncomeModel,
  SavingsGoalModel,
} from "@/prisma/generated/models";

export type CategoryInfo = Pick<CategoryModel, "id" | "name">;

// budgets
type BudgetInfo = Pick<BudgetModel, "id" | "amount" | "yearMonth">;

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
    extends Pick<ExpenseModel, "id" | "name" | "amount" | "date"> {
    category: CategoryInfo;
}

// savings goals and contributions
type ContributionInfo = Pick<ContributionModel, "id" | "amount" | "date">;

type SavingsGoalInfo = Pick<SavingsGoalModel, "id" | "name" | "amount">;

export interface ContributionById extends ContributionInfo {
    savingsGoal: Pick<SavingsGoalInfo, "id" | "name">;
}

export interface SavingsGoalById
    extends SavingsGoalInfo,
        Pick<SavingsGoalModel, "categoryId"> {}

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
type DebtInfo = Pick<DebtModel, "id" | "name" | "amount" | "interest">;

type PaymentInfo = Pick<DebtPaymentModel, "id" | "amount" | "date">;

export interface DebtById extends DebtInfo, Pick<DebtModel, "categoryId"> {}

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
    category: Pick<CategoryModel, "name">;
}

// incomes
export interface IncomeById
    extends Omit<IncomeModel, "createdAt" | "updatedAt" | "userId" | "categoryId"> {
    category: CategoryInfo;
}

export interface GroupIncomes {
    regularIncomes: IncomeById[];
    irregularIncomes: IncomeById[];
}

export interface DataByCategories {
    categoryId: string;
    categoryName: string;
    totalAmount: number;
}

export interface CardAmounts {
    [key: string]: number;
}

export interface Provider {
    id: string;
    name: string;
}

export interface SearchParamsType {
    [key: string]: string | undefined;
}