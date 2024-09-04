"use client";
import getRandomColor from "@/app/lib/utils/getRandomColor";
import { PolarArea } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, RadialLinearScale } from "chart.js";
import { CategoriesWithDebts } from "@/app/lib/interfaces";
Chart.register(ArcElement, Tooltip, RadialLinearScale);

function groupDebtsByCategory(debtsWithCategories: CategoriesWithDebts[]) {
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
    debtData: CategoriesWithDebts[];
}

const DebtCategoryChart = ({ debtData }: Props) => {
    const chartData = groupDebtsByCategory(debtData)
    
    // Generate random colors for the chart slices
    const backgroundColors = chartData.map(() => getRandomColor());
    
    // Chart data
    const data = {
        labels: chartData.map((debt) => debt.categoryName),
        datasets: [
            {
                label: "Debt",
                data: chartData.map((debt) => debt.totalAmount),
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
