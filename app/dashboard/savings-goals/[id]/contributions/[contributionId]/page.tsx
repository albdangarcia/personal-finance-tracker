import { fetchContributionById } from "@/app/lib/data";
import EditContributionForm from "@/app/ui/contributions/edit-form";
import FormWrapper from "@/app/ui/form-wrapper";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: { contributionId: string } }) => {
    // get id from params
    const id = params.contributionId;
    // get contribution by id
    const contribution = await fetchContributionById(id);

    // if contribution is not found, return nextjs default not found page
    if (!contribution) {
        return notFound();
    }

    return (
        <FormWrapper title="Contribution" description="Modify the information for your Contribution.">
            <EditContributionForm contribution={contribution} />
        </FormWrapper>
    );
}

export default Page;