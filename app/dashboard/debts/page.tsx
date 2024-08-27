import { fetchDebts, fetchDebtsPages } from "@/app/lib/data/debt";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import DebtsTable from "@/app/ui/debts/debts-table";
import { MainWrapper } from "@/app/ui/page-section-wrapper";

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
    searchParams?: {
        query?: string;
        page?: string;
    }
};

const Page = async ({ searchParams }: Props) => {
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchDebtsPages(query);
    const debts = await fetchDebts(query, currentPage);

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <MainWrapper>
                <div className="sm:col-span-2">
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