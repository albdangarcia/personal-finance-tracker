import { fetchCategories } from "@/app/lib/data";
import CreateSavingsGoalForm from "@/app/ui/savings-goals/create-form";
import FormWrapper from "@/app/ui/form-wrapper";

// Page for creating a Savings Goal
const Page = async () => {
    // Fetch all categories from the database
    const categories = await fetchCategories();

    return (
        <FormWrapper title="Create Savings Goal" description="Fill out the form below">
            {/* Pass categories to the Form component */}
            <CreateSavingsGoalForm categories={categories} />
        </FormWrapper>
    );
};

export default Page;
