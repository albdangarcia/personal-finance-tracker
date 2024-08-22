"use client";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteBudget } from "@/app/lib/actions/budget";
import { useState } from "react";
import BudgetBar from "./budget-bar";
import Link from "next/link";
import DialogComponent from "../delete-dialog";

type budgetData = {
    id: string;
    amount: number;
    yearMonth: string;
    categoryName: string;
    totalExpenses: number;
};

const BudgetCards = ({ budgetData }: { budgetData: budgetData[] }) => {
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
        <div className="grid grid-col-1 sm:grid-cols-3 gap-5 mt-4">
            {budgetData.map((budget) => {
                const budgetAmount = budget.amount;
                const totalExpenses = budget.totalExpenses;
                const budgetLeft = budgetAmount - totalExpenses;
                const isThereBudgetLeft = budgetLeft >= 0;
                
                return (
                    <div
                        key={budget.id}
                        className="bg-white shadow-sm rounded p-5 border border-gray-200/80"
                    >
                        <div className="flex justify-between">
                            <h1 className="antialiased font-medium mb-3 text-gray-900">
                                {budget.categoryName}
                            </h1>
                            {/* Link to the budget edit page */}
                            <div className="flex gap-x-2 items-start">
                                <Link
                                    href={`/dashboard/budgets/${budget.id}`}
                                    className="items-center justify-center inline-flex"
                                >
                                    <PencilSquareIcon className="h-5 w-5 text-gray-500 hover:text-gray-800" />
                                </Link>
                                <button
                                    onClick={() =>
                                        open(
                                            budget.categoryName,
                                            budget.id
                                        )
                                    }
                                    className="items-center justify-center inline-flex"
                                >
                                    <TrashIcon className="h-5 w-5 text-gray-500 hover:text-gray-800" />
                                </button>
                            </div>
                        </div>
                        {/* Budget bar */}
                        <BudgetBar
                            amount={budgetAmount}
                            totalExpenses={budget.totalExpenses}
                            isThereBudgetLeft={isThereBudgetLeft}
                            budgetLeft={budgetLeft}
                        />
                    </div>
                );
            })}
            <DialogComponent
                isOpen={isOpen}
                close={close}
                title="Budget"
                itemName={categoryName}
                handleDelete={handleDeleteBudget}
            />
        </div>
    );
};

export default BudgetCards;
