import clsx from "clsx";

// Budget bar component
const BudgetBar = ({
  allocation,
  totalExpenses,
  isThereBudgetLeft,
}: {
  allocation: number;
  totalExpenses: number;
  isThereBudgetLeft: boolean;
}) => {
  // Calculate the width percentage of the expense relative to the allocation
  const expensePercentage = Math.min((totalExpenses / allocation) * 100, 100);
  return (
    <div className="bg-gray-200 h-5 w-full rounded-full relative">
      <div
        className={clsx(
          "h-5 rounded-full",
          isThereBudgetLeft ? "bg-green-500" : "bg-red-500"
        )}
        style={{ width: `${expensePercentage}%` }}
      />
      <div
        className={clsx(
          "absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-medium",
          isThereBudgetLeft ? "text-black" : "text-white"
        )}
      >
        {`$${totalExpenses} of $${allocation}`}
      </div>
    </div>
  );
};
export default BudgetBar;
