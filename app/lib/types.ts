export type CategoryProps = {
    id: string;
    name: string;
};

export type BudgetByIdType = {
    id: string;
    amount: number;
    yearMonth: string;
    category: {
        id: string;
        name: string;
    };
};

export type FilteredBudgets = {
    id: string;
    amount: number;
    yearMonth: string;
    categoryName: string;
    totalExpenses: number;
};