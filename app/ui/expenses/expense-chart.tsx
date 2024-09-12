"use client";
import getRandomColor from "@/app/lib/utils/getRandomColor";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
import { DataByCategories } from "@/app/lib/interfaces";
import clsx from "clsx";
import NoDataMessage from "../no-data";
Chart.register(ArcElement, Tooltip);

interface Props {
    expenseData: DataByCategories[];
}

const ExpenseCategoryChart = ({ expenseData }: Props) => {
    // Generate random colors for the chart slices
    const backgroundColors = expenseData.map(() => getRandomColor());

    // Chart data
    const data = {
        labels: expenseData.map((expense) => expense.categoryName),
        datasets: [
            {
                label: "Expense",
                data: expenseData.map((expense) => expense.totalAmount),
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
                    expenseData.length === 0 &&
                        "flex items-center justify-center"
                )}
            >
                {expenseData.length > 0 ? (
                    <Pie data={data} />
                ) : (
                    <NoDataMessage />
                )}
            </div>
        </div>
    );
};

export default ExpenseCategoryChart;
