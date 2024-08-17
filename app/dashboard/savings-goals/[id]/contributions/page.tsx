import { fetchContributionsBySavingsGoalId } from "@/app/lib/data";
import ContributionsTable from "@/app/ui/contributions/contributions-table";
import { notFound } from "next/navigation";

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
            <ContributionsTable savingsGoal={savingsGoal} />
        </div>
    );
};

export default Page;
