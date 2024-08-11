"use client";
import clsx from "clsx";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import DeleteDialog from "../delete-dialog";
import BudgetBar from "./budget-bar";

export default function BudgetCard({
  category,
  budgetId,
  allocation,
  totalExpenses,
}: {
  category: string;
  budgetId: string;
  allocation: number;
  totalExpenses: number;
}) {
  // State to manage the dialog open/close
  const [isOpen, setIsOpen] = useState(false);
  const open = () => {
    setIsOpen(true);
  }
  const close = () => {
    setIsOpen(false);
  }

  // Calculate if there is budget left or over
  const budgetLeft = allocation - totalExpenses;
  const isThereBudgetLeft = budgetLeft >= 0;
  return (
    <div className="bg-white shadow-sm rounded p-5">
      <div className="flex justify-between">
        <h1 className="font-semibold mb-1 text-gray-800">{category}</h1>
        {/* Link to the budget edit page */}
        <div className="flex gap-x-2">
          <Link
            href={`/dashboard/budgets/${budgetId}`}
            className="items-center justify-center inline-flex"
          >
            <PencilSquareIcon className="h-5 w-5 text-gray-500 hover:text-gray-800" />
          </Link>
          <button
            onClick={open}
            className="items-center justify-center inline-flex"
          >
            <TrashIcon className="h-5 w-5 text-gray-500 hover:text-gray-800" />
          </button>
        </div>
      </div>
      <h4>
        <span
          className={clsx(
            "text-sm",
            isThereBudgetLeft ? "text-green-800" : "text-red-500"
          )}
        >
          ${Math.abs(budgetLeft)} {isThereBudgetLeft ? "left" : "over"}
        </span>
      </h4>
      {/* Budget bar */}
      <BudgetBar
        allocation={allocation}
        totalExpenses={totalExpenses}
        isThereBudgetLeft={isThereBudgetLeft}
      />
      {/* Delete dialog */}
      <DeleteDialog
        budgetId={budgetId}
        category={category}
        isOpen={isOpen}
        close={close}
        title="Delete Budget"
        description="Are you sure you want to delete the budget for"
      />
      
    </div>
  );
}
