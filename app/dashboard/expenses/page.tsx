import ExpenseChart from "@/app/ui/expenses/expense-chart";
import { fetchExpenses, fetchExpensesByCategory } from "@/app/lib/data";
import ExpensesTable from "@/app/ui/expenses/expenses-table";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { MainWrapper, SectionHeader, SectionWrapper } from "@/app/ui/page-section-wrapper";
import ExpenseBudgetChart from "@/app/ui/expenses/expense-budget-chart";

const breadcrumbs = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Expenses",
        href: "/dashboard/expenses",
    },
];

const Page = async () => {
    // get all the expenses
    const expenses = await fetchExpenses();
    const expensesByCategory = await fetchExpensesByCategory();

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <MainWrapper>
                <SectionWrapper>
                    <SectionHeader
                        title="Pie Chart"
                        subtitle="All the expenses by category."
                    />
                    <ExpenseChart expenseData={expensesByCategory} />
                </SectionWrapper>

                <SectionWrapper>
                    <SectionHeader
                        title="Months"
                        subtitle="Your highest expense was in March."
                    />
                    <ExpenseBudgetChart expenseData={expensesByCategory} />
                </SectionWrapper>

                <div className="sm:col-span-2">
                    <ExpensesTable expenses={expenses} />
                </div>
            </MainWrapper>
        </div>
    );
};

export default Page;
