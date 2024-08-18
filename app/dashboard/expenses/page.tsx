import ExpenseChart from "@/app/ui/expenses/expense-chart";
import { fetchExpenses, fetchExpensesByCategory } from "@/app/lib/data";
import ExpensesTable from "@/app/ui/expenses/expenses-table";
import Breadcrumbs from "@/app/ui/breadcrumbs";

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
            <ExpenseChart expenseData={expensesByCategory} />
            <ExpensesTable expenses={expenses} />
        </div>
    );
};

export default Page;
