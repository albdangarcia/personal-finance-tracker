import ExpenseCategoryChart from "@/app/ui/expenses/expense-chart";
import { fetchExpensePages, fetchExpensesByCategory, fetchFilteredExpenses, fetchLastSixMonthsExpenses } from "@/app/lib/data/expense";
import ExpensesTable from "@/app/ui/expenses/expenses-table";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import {
    MainWrapper,
    SectionHeader,
    SectionWrapper,
} from "@/app/ui/page-section-wrapper";
import ExpenseMonthChart from "@/app/ui/expenses/expense-month-chart";
import { SearchParamsType } from "@/app/lib/interfaces";

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

interface Props {
    searchParams: Promise<SearchParamsType>
}
const Page = async ({ searchParams }: Props) => {
    const { query = '', page = '1', year = '', month = '' } = await searchParams;
    
    const currentPage = Number(page);
    const totalPages = await fetchExpensePages(query, year, month);

    // Data for the pie chart
    const expensesByCategory = await fetchExpensesByCategory(year, month);

    // Fetch the expenses for the table
    const expenses = await fetchFilteredExpenses(query, currentPage, year, month);

    // fetch last six months expenses
    const expensesByMonth = await fetchLastSixMonthsExpenses();

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <MainWrapper>
                <SectionWrapper>
                    <SectionHeader
                        title="Categories"
                        subtitle="Expenses by category for the selected month."
                    />
                    <ExpenseCategoryChart expenseData={expensesByCategory} />
                </SectionWrapper>

                <SectionWrapper>
                    <SectionHeader
                        title="Months"
                        subtitle="Expenses for the last six months."
                    />
                    <ExpenseMonthChart expenseData={expensesByMonth} />
                </SectionWrapper>

                <div className="sm:col-span-2">
                    <ExpensesTable expenses={expenses} totalPages={totalPages} />
                </div>
            </MainWrapper>
        </div>
    );
};

export default Page;
