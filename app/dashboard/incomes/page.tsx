import { fetchFilteredIncomes } from "@/app/lib/data/income";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import IncomesTable from "@/app/ui/incomes/incomes-table";
import { MainWrapper } from "@/app/ui/page-section-wrapper";

const breadcrumbs = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Incomes",
        href: "/dashboard/incomes",
    },
];

interface PageProps {
    searchParams?: {
        query?: string;
        page?: string;
    }
};

const Page = async ({ searchParams }: PageProps) => {
    // Set default values for query and page
    const query = searchParams?.query || "";

    // Set current page to 1 if no page is provided
    const currentPage = Number(searchParams?.page) || 1;
    
    // const totalPages = await fetchIncomesPages(query);
    const { regularIncomes, irregularIncomes } = await fetchFilteredIncomes(query, currentPage);
    
    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <MainWrapper>
                <div className="sm:col-span-2">
                    <IncomesTable
                        regularIncomes={regularIncomes}
                        irregularIncomes={irregularIncomes}
                    />
                </div>
            </MainWrapper>
        </div>
    );
}

export default Page;