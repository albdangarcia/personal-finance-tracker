import { fetchPaymentsByDebtId } from "@/app/lib/data/payment";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import PaymentsTable from "@/app/ui/debtPayments/payments-table";
import { notFound } from "next/navigation";

const breadcrumbs = (id: string) => [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Debts",
        href: "/dashboard/debts",
    },
    {
        label: "Payments",
        href: `/dashboard/debts/${id}/payments`,
    },
];

const Page = async ({ params }: { params: { id: string } }) => {
    // get id from params
    const id = params.id;

    // get payments by debt id
    const debt = await fetchPaymentsByDebtId(id);

    // if debt is not found, return nextjs default not found page
    if (!debt) {
        return notFound();
    }

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs(id)} />
            <PaymentsTable debt={debt} />
        </div>
    );
}

export default Page;