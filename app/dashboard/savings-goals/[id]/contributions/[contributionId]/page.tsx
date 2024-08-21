import { fetchContributionById } from "@/app/lib/data/contribution";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import EditContributionForm from "@/app/ui/contributions/edit-form";
import FormWrapper from "@/app/ui/form-wrapper";
import { notFound } from "next/navigation";

const breadcrumbs = (id: string, goalId: string) => [
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
        href: `/dashboard/savings-goals/${goalId}/contributions`,
    },
    {
        label: "Edit",
        href: `/dashboard/savings-goals/${goalId}/contributions/${id}`,
    },
];

const Page = async ({ params }: { params: { id: string, contributionId: string } }) => {
    // get id from params
    const id = params.contributionId;
    const goalId = params.id;

    // get contribution by id
    const contribution = await fetchContributionById(id);

    // if contribution is not found, return nextjs default not found page
    if (!contribution) {
        return notFound();
    }

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs(id, goalId)} />
            <FormWrapper title="Contribution" description="Modify the information for your Contribution.">
                <EditContributionForm contribution={contribution} />
            </FormWrapper>
        </div>
    );
}

export default Page;