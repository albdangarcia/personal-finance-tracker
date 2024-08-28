"use client";
import getRandomColor from "@/app/lib/utils/getRandomColor";
import { PolarArea } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, RadialLinearScale } from "chart.js";
import { DebtWithCategories } from "@/app/lib/interfaces";
Chart.register(ArcElement, Tooltip, RadialLinearScale);

function groupDebtsByCategory(debtsWithCategories: DebtWithCategories[]) {
    const groupedDebts = debtsWithCategories.reduce<Record<string, number>>((acc, debtCategory) => {
        const categoryName = debtCategory.name;
        const totalAmount = debtCategory.debts.reduce((sum, debt) => sum + debt.amount, 0);

        if (acc[categoryName]) {
            acc[categoryName] += totalAmount;
        } else {
            acc[categoryName] = totalAmount;
        }

        return acc;
    }, {});

    return Object.entries(groupedDebts).map(([categoryName, totalAmount]) => ({
        categoryName,
        totalAmount,
    }));
}


interface Props {
    debtData: DebtWithCategories[];
}

const DebtCategoryChart = ({ debtData }: Props) => {

    const chartData = groupDebtsByCategory(debtData)
    
    // Generate random colors for the chart slices
    const backgroundColors = chartData.map(() => getRandomColor());
    
    // Chart data
    const data = {
        // labels: debtData.map((debt) => debt.categoryName),
        labels: chartData.map((debt) => debt.categoryName),
        datasets: [
            {
                label: "Expense",
                data: chartData.map((expense) => expense.totalAmount),
                backgroundColor: backgroundColors,
                hoverOffset: 4,
            },
        ],
    };
    return (
        <div className="flex">
            <div className="w-80 h-80 mx-auto">
                <PolarArea data={data} />
            </div>
        </div>
    );
};
export default DebtCategoryChart;
