"use client";
import getRandomColor from "@/app/lib/utils/getRandomColor";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
import { DataByCategories } from "@/app/lib/interfaces";
Chart.register(ArcElement, Tooltip);


interface Props {
    incomeData: DataByCategories[];
}

const IncomeCategoryChart = ({ incomeData }: Props) => {
    // Generate random colors for the chart slices
    const backgroundColors = incomeData.map(() => getRandomColor());
    
    // Chart data
    const data = {
        labels: incomeData.map((income) => income.categoryName),
        datasets: [
            {
                label: "income",
                data: incomeData.map((income) => income.totalAmount),
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
export default IncomeCategoryChart;
