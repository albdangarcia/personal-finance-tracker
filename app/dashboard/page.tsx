import {
    CreditCardIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    CalculatorIcon,
} from "@heroicons/react/24/outline";
import Breadcrumbs from "../ui/breadcrumbs";
import TotalAmountCard from "../ui/dashboard/amount-card";
import { SectionHeader, SectionWrapper } from "../ui/page-section-wrapper";
import ExpenseMonthChart from "../ui/expenses/expense-month-chart";
import {
    fetchExpenseTotalAmount,
    fetchLastSixMonthsExpenses,
} from "../lib/data/expense";
import BudgetMonthChart from "../ui/budgets/budgets-month-chart";
import {
    fetchBudgetTotalAmount,
    fetchLastSixMonthsBudgets,
} from "../lib/data/budget";
import { fetchIncomeTotalAmount } from "../lib/data/income";
import { fetchDebtTotalAmount } from "../lib/data/debt";

const breadcrumbs = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
];

const calculatePercentageChange = (
    current: number,
    previous: number
): number => {
    if (previous === 0) return 100; // Handle division by zero
    const change = ((current - previous) / previous) * 100;
    return Math.round(change);
};

const Page = async () => {
    // Data for the month chart
    const lastSixMonthsBudgets = await fetchLastSixMonthsBudgets();

    // Fetch last six months expenses
    const expensesByMonth = await fetchLastSixMonthsExpenses();

    // Get the total budget of the current month
    const { budgetAmount, previousBudgetAmount } =
        await fetchBudgetTotalAmount();

    // Get the total income of the current month
    const { incomeAmount, previousIncomeAmount } =
        await fetchIncomeTotalAmount();

    // Get the total expenses of the current month
    const { expenseAmount, previousExpenseAmount } =
        await fetchExpenseTotalAmount();

    // Get the total debts of the current month
    const { debtAmount, previousDebtAmount } =
        await fetchDebtTotalAmount();

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Budget amount */}
                <TotalAmountCard
                    title="Total Budget"
                    total={budgetAmount}
                    icon={ChartBarIcon}
                    percentageChange={calculatePercentageChange(
                        budgetAmount,
                        previousBudgetAmount
                    )}
                />

                {/* Income amount */}
                <TotalAmountCard
                    title="Total Incomes"
                    total={incomeAmount}
                    icon={CurrencyDollarIcon}
                    percentageChange={calculatePercentageChange(
                        incomeAmount,
                        previousIncomeAmount
                    )}
                />

                {/* Expenses amount */}
                <TotalAmountCard
                    title="Total Expenses"
                    total={expenseAmount}
                    icon={CalculatorIcon}
                    percentageChange={calculatePercentageChange(
                        expenseAmount,
                        previousExpenseAmount
                    )}
                />

                {/* Debts amount */}
                <TotalAmountCard
                    title="Total Debts"
                    total={debtAmount}
                    icon={CreditCardIcon}
                    percentageChange={calculatePercentageChange(
                        debtAmount,
                        previousDebtAmount
                    )}
                />
                <div className="col-span-2">
                    <SectionWrapper>
                        <SectionHeader
                            title="Expenses"
                            subtitle="Expenses for the last six months."
                        />
                        <ExpenseMonthChart expenseData={expensesByMonth} />
                    </SectionWrapper>
                </div>
                <div className="col-span-2">
                    <SectionWrapper>
                        <SectionHeader
                            title="Budgets"
                            subtitle="Budgets for the last six months."
                        />
                        <BudgetMonthChart
                            monthlyBudgets={lastSixMonthsBudgets}
                            monthlyExpenses={expensesByMonth}
                        />
                    </SectionWrapper>
                </div>
            </div>
        </div>
    );
};

export default Page;
