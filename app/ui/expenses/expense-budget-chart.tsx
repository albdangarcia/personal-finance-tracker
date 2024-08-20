"use client";
import { Line } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
Chart.register(ArcElement, Tooltip, CategoryScale, LinearScale, PointElement, LineElement);

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
  
const ExpenseBudgetChart = ({
    expenseData,
}: {
    expenseData: ExpenseDataType[];
}) => {
    // Chart data
    const labels = ["January", "February", "March", "April", "May", "June", "July"];
    const data = {
        labels: labels,
        datasets: [
            {
                label: "Expenses",
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: "red",
                backgroundColor: "red",
            },
        ],
    };
    return (
        <div className="flex">
            <div className="w-80 h-w-80 mx-auto">
                <Line data={data} />
            </div>
        </div>
    );
};
export default ExpenseBudgetChart;
