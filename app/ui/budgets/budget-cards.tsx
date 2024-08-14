"use client";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteBudget } from "@/app/lib/actions/budget";
import { useState } from "react";
import clsx from "clsx";
import BudgetBar from "./budget-bar";
import Link from "next/link";

type BudgetsProps = {
  totalExpenses: number;
  name: string;
  budget: {
    id: string;
    amount: number;
  } | null;
  expenses: {
    amount: number;
  }[];
};
const BudgetCards = ({ budgetData }: { budgetData: BudgetsProps[] }) => {
  // State to manage the dialog open/close
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [budgetId, setBudgetId] = useState<string>("");

  // Dialog open/close
  const open = (cagetoryName: string, budgetId: string) => {
    setBudgetId(budgetId);
    setCategoryName(cagetoryName);
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };

  // Handle delete budget
  const handleDeleteBudget = async () => {
    try {
      await deleteBudget(budgetId);
      close();
    } catch (error) {
      console.error("Failed to delete budget:", error);
      throw new Error("Failed to delete budget");
    }
  };
  return (
    <div className="grid grid-col-1 sm:grid-cols-3 gap-5 p-3">
      {budgetData.map((category) => {
        const budgetAmount = category.budget?.amount ?? 0;
        const totalExpenses = category.totalExpenses;
        const budgetLeft = budgetAmount - totalExpenses;
        const isThereBudgetLeft = budgetLeft >= 0;
        return (
          <div key={category.name} className="bg-white shadow rounded p-5">
            <div className="flex justify-between">
              <h1 className="font-medium mb-3 text-gray-800">
                {category.name}
              </h1>
              {/* Link to the budget edit page */}
              <div className="flex gap-x-2">
                <Link
                  href={`/dashboard/budgets/${category.budget?.id}`}
                  className="items-center justify-center inline-flex"
                >
                  <PencilSquareIcon className="h-5 w-5 text-gray-500 hover:text-gray-800" />
                </Link>
                <button
                  onClick={() => open(category.name, category.budget?.id ?? "")}
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
              amount={budgetAmount}
              totalExpenses={category.totalExpenses}
              isThereBudgetLeft={isThereBudgetLeft}
            />
          </div>
        );
      })}
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-black/25 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-white"
              >
                Delete Expense
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-white/80">
                Are you sure you want to delete the Budget for {categoryName}?
              </p>
              <div className="mt-4 flex gap-x-2">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={close}
                >
                  Cancel
                </Button>
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={handleDeleteBudget}
                >
                  Delete
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default BudgetCards;
