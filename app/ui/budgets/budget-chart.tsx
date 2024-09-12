"use client";
import getRandomColor from "@/app/lib/utils/getRandomColor";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
import { FilteredBudgets } from "@/app/lib/interfaces";
import clsx from "clsx";
import NoDataMessage from "../no-data";
Chart.register(ArcElement, Tooltip);

const BudgetChart = ({ budgetData }: { budgetData: FilteredBudgets[] }) => {
    // Generate random colors for the chart slices
    const backgroundColors = budgetData.map(() => getRandomColor());
    // Chart data
    const data = {
        labels: budgetData.map((budget) => budget.categoryName),
        datasets: [
            {
                label: "Budgets",
                data: budgetData.map((budget) => budget.amount),
                backgroundColor: backgroundColors,
                hoverOffset: 4,
            },
        ],
    };
    return (
        <div className="flex">
            <div
                className={clsx(
                    "w-32 h-32 mx-auto",
                    budgetData.length === 0 &&
                        "flex items-center justify-center"
                )}
            >
                {budgetData.length > 0 ? (
                    <Doughnut data={data} />
                ) : (
                    <NoDataMessage />
                )}
            </div>
        </div>
    );
};

export default BudgetChart;
