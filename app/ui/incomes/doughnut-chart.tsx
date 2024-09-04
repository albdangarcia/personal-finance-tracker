"use client";
import getRandomColor from "@/app/lib/utils/getRandomColor";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
import { IncomeById } from "@/app/lib/interfaces";
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
        <div className="flex ">
            <div className="w-32 h-32 mx-auto">
                <Doughnut data={data} />
            </div>
        </div>
    );
};

export default IncomeChart;
