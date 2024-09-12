"use client";
import getRandomColor from "@/app/lib/utils/getRandomColor";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
import { IncomeById } from "@/app/lib/interfaces";
import NoDataMessage from "../no-data";
import clsx from "clsx";
Chart.register(ArcElement, Tooltip);

interface Props {
    regularIncomes: IncomeById[];
    irregularIncomes: IncomeById[];
}

const IncomeChart = ({ regularIncomes, irregularIncomes }: Props) => {
    // Add all the regular income property amount
    const regularIncomeAmount = regularIncomes.reduce(
        (acc, income) => acc + income.amount,
        0
    );
    // Add all the irregular income property amount
    const irregularIncomeAmount = irregularIncomes.reduce(
        (acc, income) => acc + income.amount,
        0
    );
    // Generate random colors for the chart slices
    const backgroundColors = [getRandomColor(), getRandomColor()];

    // Chart data
    const data = {
        labels: ["Regular", "Irregular"],
        datasets: [
            {
                label: "incomes",
                data: [regularIncomeAmount, irregularIncomeAmount],
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
                    regularIncomes.length === 0 &&
                        irregularIncomes.length === 0 &&
                        "flex items-center justify-center"
                )}
            >
                {regularIncomes.length > 0 || irregularIncomes.length > 0 ? (
                    <Doughnut data={data} />
                ) : (
                    <NoDataMessage />
                )}
            </div>
        </div>
    );
};

export default IncomeChart;
