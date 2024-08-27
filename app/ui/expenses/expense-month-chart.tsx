"use client";
import { Line } from "react-chartjs-2";
import {
    Chart,
    ArcElement,
    Tooltip,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from "chart.js";
import { MonthlyExpenses } from "@/app/lib/interfaces";
Chart.register(
    ArcElement,
    Tooltip,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

interface Props {
    expenseData: MonthlyExpenses[];
}

const ExpenseMonthChart = ({ expenseData }: Props) => {
    // Month labels
    const labels = expenseData.map((expense) => expense.monthLabel);
    // Data for the line chart
    const data = {
        labels: labels,
        datasets: [
            {
                label: "Expenses",
                data: expenseData.map((data) => data.totalAmount),
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
export default ExpenseMonthChart;
