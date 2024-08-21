import ExpenseChart from "@/app/ui/expenses/expense-chart";
import { fetchExpensesByCategory, fetchFilteredExpenses } from "@/app/lib/data/expense";
import ExpensesTable from "@/app/ui/expenses/expenses-table";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import {
    MainWrapper,
    SectionHeader,
    SectionWrapper,
} from "@/app/ui/page-section-wrapper";
import ExpenseBudgetChart from "@/app/ui/expenses/expense-budget-chart";
import { fetchExpensePages } from "@/app/lib/data/expense";

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

type PageProps = {
    searchParams?: {
        query?: string;
        page?: string;
    }
};

const Page = async ({ searchParams }: PageProps) => {
    // Data for the charts
    const expensesByCategory = await fetchExpensesByCategory();

    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchExpensePages(query);
    
    // Fetch the expenses for the table
    const expenses = await fetchFilteredExpenses(query, currentPage);

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
                    <ExpensesTable expenses={expenses} totalPages={totalPages} />
                </div>
            </MainWrapper>
        </div>
    );
};

export default Page;
