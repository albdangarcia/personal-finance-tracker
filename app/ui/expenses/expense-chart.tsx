"use client";
import { getRandomColor } from "@/app/lib/utils";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
Chart.register(ArcElement, Tooltip);

type ExpenseDataType = {
    _sum: {
        amount: number | null;
    };
    category:
        | {
              id: string;
              name: string;
          }
        | undefined;
};

const ExpenseChart = ({ expenseData }: { expenseData: ExpenseDataType[] }) => {
    // Generate random colors for the chart slices
    const backgroundColors = expenseData.map(() => getRandomColor());
    // Chart data
    const data = {
        labels: expenseData.map(
            (expense) => expense.category?.name ?? "Unknown"
        ),
        datasets: [
            {
                label: "Expenses",
                data: expenseData.map((expense) => expense._sum.amount ?? 0),
                backgroundColor: backgroundColors,
                hoverOffset: 4,
            },
        ],
    };
    return (
        <div className="flex">
            <div className="w-32 h-32 mx-auto">
                <Pie data={data} />
            </div>
        </div>
    );
};
export default ExpenseChart;
