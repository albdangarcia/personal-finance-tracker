"use client";
import getRandomColor from "@/app/lib/utils/getRandomColor";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
import { DataByCategories } from "@/app/lib/interfaces";
import clsx from "clsx";
import NoDataMessage from "../no-data";
Chart.register(ArcElement, Tooltip);

interface Props {
    savingGoalsData: DataByCategories[];
}

const CategoryChart = ({ savingGoalsData }: Props) => {
    // Generate random colors for the chart slices
    const backgroundColors = savingGoalsData.map(() => getRandomColor());

    // Chart data
    const data = {
        labels: savingGoalsData.map((goal) => goal.categoryName),
        datasets: [
            {
                label: "Savings Goals",
                data: savingGoalsData.map((goal) => goal.totalAmount),
                backgroundColor: backgroundColors,
                hoverOffset: 4,
            },
        ],
    };
    return (
        <div className="flex">
            <div
                className={clsx(
                    "w-80 h-80 mx-auto",
                    savingGoalsData.length === 0 &&
                        "flex items-center justify-center"
                )}
            >
                {savingGoalsData.length > 0 ? (
                    <Pie data={data} />
                ) : (
                    <NoDataMessage />
                )}
            </div>
        </div>
    );
};

export default CategoryChart;
