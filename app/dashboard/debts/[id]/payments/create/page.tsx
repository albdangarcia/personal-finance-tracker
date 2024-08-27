import Breadcrumbs from "@/app/ui/breadcrumbs";
import CreatePaymentForm from "@/app/ui/debtPayments/create-form";
import FormWrapper from "@/app/ui/form-wrapper";
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
    {
        label: "Create",
        href: `/dashboard/debts/${id}/payments/create`,
    },
];

const Page = ({ params }: { params: { id: string } }) => {
    // Get the id from the params
    const id = params.id;

    // If there is no id, return a 404 page
    if (!id) {
        return notFound();
    }

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs(id)} />
            <FormWrapper
                title="Payment"
                description="Please provide the details for your Payment below."
            >
                {/* Pass categories to the Form component */}
                <CreatePaymentForm debtId={id} />
            </FormWrapper>
        </div>
    );
}

export default Page;