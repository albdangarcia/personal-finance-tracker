"use client";
import { getRandomColor} from "@/app/lib/utils";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
Chart.register(ArcElement, Tooltip);

type BudgetDataType = {
  name: string;
  budget: {
      amount: number;
  } | null;
}

export default function BudgetChart({
  budgetData,
}: {
  budgetData: BudgetDataType[];
}) {
  // Generate random colors for the chart slices
  const backgroundColors = budgetData.map(() => getRandomColor());
  // Chart data
  const data = {
    labels: budgetData.map((data) => data.name),
    datasets: [
      {
        label: "Budgets",
        data: budgetData.map((data) => data.budget?.amount ?? 0),
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
}
