import CreateContributionForm from "@/app/ui/contributions/create-form";
import FormWrapper from "@/app/ui/form-wrapper";
import { notFound } from "next/navigation";

const Page = ({ params }: { params: { id: string } }) => {
    const id = params.id;
    console.log(id);
    if (!id) {
        return notFound();
    }
    return (
        <FormWrapper
            title="Contribution"
            description="Please provide the details for your Contribution below."
        >
            {/* Pass categories to the Form component */}
            <CreateContributionForm goalId={id}/>
        </FormWrapper>
    );
};

export default Page;
