import Breadcrumbs from "@/app/ui/breadcrumbs";
import CreateContributionForm from "@/app/ui/contributions/create-form";
import FormWrapper from "@/app/ui/form-wrapper";
import { notFound } from "next/navigation";

const breadcrumbs = (id: string) => [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Savings Goals",
        href: "/dashboard/savings-goals",
    },
    {
        label: "Contributions",
        href: `/dashboard/savings-goals/${id}/contributions`,
    },
    {
        label: "Create",
        href: `/dashboard/savings-goals/${id}/contributions/create`,
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
                title="Contribution"
                description="Please provide the details for your Contribution below."
            >
                {/* Pass categories to the Form component */}
                <CreateContributionForm goalId={id} />
            </FormWrapper>
        </div>
    );
};

export default Page;
