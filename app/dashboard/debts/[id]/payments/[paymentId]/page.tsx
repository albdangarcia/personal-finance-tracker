import { fetchPaymentById } from "@/app/lib/data/payment";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import EditPaymentForm from "@/app/ui/debtPayments/edit-form";
import FormWrapper from "@/app/ui/form-wrapper";
import { notFound } from "next/navigation";

const breadcrumbs = (id: string, budgetId: string) => [
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
        href: `/dashboard/debts/${budgetId}/payments`,
    },
    {
        label: "Edit",
        href: `/dashboard/debts/${budgetId}/payments/${id}`,
    },
];

interface Props {
    params: { id: string; paymentId: string };
}

const Page = async ({ params }: Props) => {
    // get id from params
    const id = params.paymentId;
    const debtId = params.id;

    // get payment by id
    const payment = await fetchPaymentById(id);

    // if payment is not found, return nextjs default not found page
    if (!payment) {
        return notFound();
    }

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs(id, debtId)} />
            <FormWrapper
                title="Payment"
                description="Modify the information for your Payment."
            >
                <EditPaymentForm payment={payment} />
            </FormWrapper>
        </div>
    );
};

export default Page;
