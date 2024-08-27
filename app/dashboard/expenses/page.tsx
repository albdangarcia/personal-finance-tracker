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

interface PageProps {
    searchParams?: {
        query?: string;
        page?: string;
        year?: string;
        month?: string;
    }
};

const Page = async ({ searchParams }: PageProps) => {
    // Get the query from the search params
    const query = searchParams?.query || "";

    const year = searchParams?.year || "";
    const month = searchParams?.month || "";

    const currentPage = Number(searchParams?.page) || 1;
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
                        title="Pie Chart"
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
