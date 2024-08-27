"use client";
import getRandomColor from "@/app/lib/utils/getRandomColor";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
import { ExpensesByCategories } from "@/app/lib/interfaces";
Chart.register(ArcElement, Tooltip);

interface Props {
    expenseData: ExpensesByCategories[];
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
            <div className="w-32 h-32 mx-auto">
                <Pie data={data} />
            </div>
        </div>
    );
};
export default ExpenseCategoryChart;
