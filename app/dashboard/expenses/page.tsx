import ExpenseChart from "@/app/ui/expenses/expense-chart";
import { fetchExpenses, fetchExpensesByCategory } from "@/app/lib/data";
import ExpensesTable from "@/app/ui/expenses/expenses-table";

const Page = async () => {
    // get all the expenses
    const expenses = await fetchExpenses();
    const expensesByCategory = await fetchExpensesByCategory();

    return (
        <div>
            <ExpenseChart expenseData={expensesByCategory} />
            <ExpensesTable expenses={expenses} />
        </div>
    );
};

export default Page;
