import clsx from "clsx";

type BudgetBarProps = {
    amount: number;
    totalExpenses: number;
    isThereBudgetLeft: boolean;
};

// Budget bar component
const BudgetBar = ({
    amount,
    totalExpenses,
    isThereBudgetLeft,
}: BudgetBarProps) => {
    // Calculate the width percentage of the expense relative to the amount
    const expensePercentage = Math.min((totalExpenses / amount) * 100, 100);
    return (
        <div className="bg-gray-100 h-5 w-full rounded-sm relative">
            <div
                className={clsx(
                    "h-5 rounded-sm",
                    isThereBudgetLeft ? "bg-[#73ca93]" : "bg-[#f56565]"
                )}
                style={{ width: `${expensePercentage}%` }}
            />
            <div
                className={clsx(
                    "absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-medium",
                    isThereBudgetLeft ? "text-gray-800" : "text-white"
                )}
            >
                {`$${totalExpenses} of $${amount}`}
            </div>
        </div>
    );
};

export default BudgetBar;
