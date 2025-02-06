import { fetchDebts, fetchDebtsPages } from "@/app/lib/data/debt";
import { SearchParamsType } from "@/app/lib/interfaces";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import DebtCategoryChart from "@/app/ui/debts/debts-chart";
import DebtsTable from "@/app/ui/debts/debts-table";
import { MainWrapper, SectionHeader, SectionWrapper } from "@/app/ui/page-section-wrapper";

const breadcrumbs = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Debts",
        href: "/dashboard/debts",
    },
];

interface Props {
    searchParams: Promise<SearchParamsType>
}

const Page = async ({ searchParams }: Props) => {
    // Get the query and page from the URL
    const { query = '', page = '1' } = await searchParams;
    const currentPage = Number(page);

    // Fetch toal pages and debts
    const totalPages = await fetchDebtsPages(query);
    const debts = await fetchDebts(query, currentPage);

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <MainWrapper>
                <div className="col-span-2">
                    <SectionWrapper>
                        <SectionHeader
                            title="Categories"
                            subtitle="Amount of debt by category."
                        />
                        <DebtCategoryChart debtData={debts} />
                    </SectionWrapper>
                </div>
                <div className="col-span-2">
                    <DebtsTable
                        categoriesWithDebts={debts}
                        totalPages={totalPages}
                    />
                </div>
            </MainWrapper>
        </div>
    )
}

export default Page;