"use client";
import { Line, Bar } from "react-chartjs-2";
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
Chart.register(
    ArcElement,
    Tooltip,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
);

type BudgetDataType = {
    name: string;
    budget: {
        amount: number;
    } | null;
};

const BudgetMonthChart = ({ budgetData }: { budgetData: BudgetDataType[] }) => {
    // Chart data
    const labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
    ];
    const data = {
        labels: labels,
        datasets: [
            {
                label: "Budget",
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: "#73ca93",
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
