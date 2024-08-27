export interface CategoryProps {
    id: string;
    name: string;
}

export interface BudgetByIdType {
    id: string;
    amount: number;
    yearMonth: string;
    category: {
        id: string;
        name: string;
    };
}

export interface FilteredBudgets {
    id: string;
    amount: number;
    yearMonth: string;
    categoryName: string;
    totalExpenses: number;
}

export interface MonthlyBudgets {
    month: string;
    totalAmount: number;
}

export interface MonthlyExpenses {
    monthLabel: string;
    totalAmount: number;
}

export interface ExpenseById {
    id: string;
    name: string;
    amount: number;
    date: Date;
    category: {
        id: string;
        name: string;
    };
}

export interface ExpensesByCategories {
    categoryId: string;
    categoryName: string;
    totalAmount: number;
}

export interface FilteredExpenses {
    id: string;
    name: string;
    amount: number;
    date: Date;
    category: {
        id: string;
        name: string;
    };
}

export interface GoalWithContributions {
    id: string;
    name: string;
    amount: number;
    category: {
        name: string;
    };
    contributions: {
        id: string;
        amount: number;
        date: Date;
    }[];
}

export interface ContributionInfo {
    id: string;
    amount: number;
    date: Date;
    savingsGoal: {
        id: string;
        name: string;
    };
}

export interface CategoriesWithGoals {
    savingsGoals: {
        totalContributions: number;
        id: string;
        name: string;
        amount: number;
        contributions: {
            amount: number;
        }[];
    }[];
    id: string;
    name: string;
}

export interface SavingsGoal {
    id: string;
    name: string;
    amount: number;
    categoryId: string;
}