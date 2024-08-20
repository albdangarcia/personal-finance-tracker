"use client";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteBudget } from "@/app/lib/actions/budget";
import { useState } from "react";
import clsx from "clsx";
import BudgetBar from "./budget-bar";
import Link from "next/link";
import DialogComponent from "../delete-dialog";

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
        <div className="grid grid-col-1 sm:grid-cols-3 gap-5 mt-4">
            {budgetData.map((category) => {
                const budgetAmount = category.budget?.amount ?? 0;
                const totalExpenses = category.totalExpenses;
                const budgetLeft = budgetAmount - totalExpenses;
                const isThereBudgetLeft = budgetLeft >= 0;
                return (
                    <div
                        key={category.name}
                        className="bg-white shadow-sm rounded p-5 border border-gray-200/80"
                    >
                        <div className="flex justify-between">
                            <h1 className="antialiased font-medium mb-3 text-gray-900">
                                {category.name}
                            </h1>
                            {/* Link to the budget edit page */}
                            <div className="flex gap-x-2 items-start">
                                <Link
                                    href={`/dashboard/budgets/${category.budget?.id}`}
                                    className="items-center justify-center inline-flex"
                                >
                                    <PencilSquareIcon className="h-5 w-5 text-gray-500 hover:text-gray-800" />
                                </Link>
                                <button
                                    onClick={() =>
                                        open(
                                            category.name,
                                            category.budget?.id ?? ""
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
                            totalExpenses={category.totalExpenses}
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
            {/* <Dialog
                open={isOpen}
                as="div"
                className="relative z-10 focus:outline-none"
                onClose={close}
            >
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-gradient-to-b from-black/10 to-black/50">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="text-gray-900 w-full max-w-md rounded-xl bg-white p-6 duration-300 ease-out transform data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            <DialogTitle
                                as="h3"
                                className="text-base/7 font-medium"
                            >
                                Delete Expense
                            </DialogTitle>
                            <p className="mt-2 text-sm/6 text-gray-600">
                                Are you sure you want to delete the Budget for{" "}
                                <span className="text-black">{categoryName}</span>?
                            </p>
                            <div className="mt-4 flex gap-x-2 border-t pt-4">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-black py-1.5 px-3 text-sm/6 font-semibold text-white shadow-white/10 focus:outline-none data-[hover]:bg-gray-800 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
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
            </Dialog> */}
        </div>
    );
};

export default BudgetCards;
