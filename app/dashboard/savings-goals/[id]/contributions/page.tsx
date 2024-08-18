import { fetchContributionsBySavingsGoalId } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import ContributionsTable from "@/app/ui/contributions/contributions-table";
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
];

const Page = async ({ params }: { params: { id: string } }) => {
    // get id from params
    const id = params.id;

    // get contributions by savings goal id
    const savingsGoal = await fetchContributionsBySavingsGoalId(id);

    // if savings goal is not found, return nextjs default not found page
    if (!savingsGoal) {
        return notFound();
    }

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs(id)} />
            <ContributionsTable savingsGoal={savingsGoal} />
        </div>
    );
};

export default Page;
