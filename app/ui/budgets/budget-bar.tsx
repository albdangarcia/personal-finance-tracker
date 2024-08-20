import clsx from "clsx";

type BudgetBarProps = {
    amount: number;
    totalExpenses: number;
    isThereBudgetLeft: boolean;
    budgetLeft: number;
};

// Budget bar component
const BudgetBar = ({
    amount,
    totalExpenses,
    isThereBudgetLeft,
    budgetLeft,
}: BudgetBarProps) => {
    // Calculate the width percentage of the expense relative to the amount
    const expensePercentage = Math.min((totalExpenses / amount) * 100, 100);
    return (
        <div className="text-xs font-medium">
            <div className="w-full h-full flex text-gray-700 mb-1">
                {`$${totalExpenses} of $${amount}`}
            </div>

            {/* bar */}
            <div className="bg-gray-100 h-1 w-full rounded-sm relative">
                <div
                    className={clsx(
                        "h-full rounded-sm",
                        isThereBudgetLeft ? "bg-[#73ca93]" : "bg-[#f56565]"
                    )}
                    style={{ width: `${expensePercentage}%` }}
                />
            </div>

            <h4 className="mt-1 justify-end flex">
                <span
                    className={clsx(
                        isThereBudgetLeft ? "text-green-800" : "text-red-500"
                    )}
                >
                    ${Math.abs(budgetLeft)}{" "}
                    {isThereBudgetLeft ? "left" : "over"}
                </span>
            </h4>
        </div>
    );
};

export default BudgetBar;
