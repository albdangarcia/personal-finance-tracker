import { fetchAvailableCategories } from "@/app/lib/data";
import CreateBudgetForm from "@/app/ui/budgets/create-form";
import FormWrapper from "@/app/ui/form-wrapper";

// Page for creating a budget
const Page = async () => {
    // Fetch categories from the database
    const categories = await fetchAvailableCategories();

    return (
        <FormWrapper formTitle="Create Budget">
            {/* Pass categories to the Form component */}
            <CreateBudgetForm categories={categories} />
        </FormWrapper>
    );
};

export default Page;
