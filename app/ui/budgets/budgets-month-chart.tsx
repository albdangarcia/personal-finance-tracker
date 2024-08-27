"use client";
import { Bar } from "react-chartjs-2";
import {
    Chart,
    ArcElement,
    Tooltip,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
} from "chart.js";
import { MonthlyBudgets, MonthlyExpenses } from "@/app/lib/interfaces";
Chart.register(
    ArcElement,
    Tooltip,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement
);

interface Props {
    monthlyBudgets: MonthlyBudgets[];
    monthlyExpenses: MonthlyExpenses[];
}

const BudgetMonthChart = ({ monthlyBudgets, monthlyExpenses }: Props) => {
    // Chart data
    const data = {
        labels: monthlyBudgets.map((budget) => budget.month),
        datasets: [
            {
                label: "Budget",
                data: monthlyBudgets.map((budget) => budget.totalAmount),
                backgroundColor: "rgba(115, 202, 147, 0.82)",
                borderColor: "rgba(51, 202, 147, 1)",
                borderWidth: 1,
            },
            {
                label: "Expense",
                data: monthlyExpenses.map((expense) => expense.totalAmount),
                backgroundColor: "rgba(241, 50, 50, 0.68)",
                borderColor: "red",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="flex">
            <div className="w-80 h-w-80 mx-auto">
                <Bar data={data} />
            </div>
        </div>
    );
};

export default BudgetMonthChart;
