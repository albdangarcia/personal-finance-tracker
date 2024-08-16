"use client";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { deleteExpense } from "@/app/lib/actions/expense";
import CreateButton from "../create-new-button";

type ExpensesProps = {
    id: string;
    name: string;
    amount: number;
    category: {
        id: string;
        name: string;
    };
    date: Date;
};

const ExpensesTable = ({ expenses }: { expenses: ExpensesProps[] }) => {
    // State to manage the dialog open/close
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [expenseName, setExpenseName] = useState<string>("");
    const [expenseId, setExpenseId] = useState<string>("");

    // Dialog open/close
    const open = (expense: string, expenseId: string) => {
        setExpenseId(expenseId);
        setExpenseName(expense);
        setIsOpen(true);
    };
    const close = () => {
        setIsOpen(false);
    };

    // Handle delete expense
    const handleDeleteExpense = async () => {
        if (!expenseId) {
            return;
        }
        console.log("Deleting Expense:", expenseName);
        try {
            await deleteExpense(expenseId);
            close();
        } catch (error) {
            console.error("Failed to delete Expense:", error);
            throw new Error("Failed to delete Expense");
        }
    };

    return (
        <div className="antialiased mt-6 bg-white border border-gray-200 rounded-md shadow-sm pb-4 pt-10 px-8">
            <div className="flex justify-between">
                <div>
                    <h4 className="font-medium">Expenses</h4>
                    <p className="mt-2.5 mb-5 text-sm text-gray-500">
                        All the expenses you have added are listed here.
                    </p>
                </div>
                <CreateButton hrefLink="/dashboard/expenses/create" />
            </div>

            {/* table headers */}
            <div className="hidden border-b mt-1 gap-4 py-4 rounded-t-md text-sm font-medium sm:grid grid-cols-[minmax(150px,1fr)_repeat(3,minmax(10px,1fr))_minmax(80px,1fr)]">
                <div className="text-nowrap">Name</div>
                <div className="text-nowrap">Amount</div>
                <div className="text-nowrap">Category</div>
                <div className="text-nowrap">Date</div>
                <div className="text-nowrap text-center sr-only">Edit</div>
            </div>

            {/* table contents */}
            <div className="text-sm [&>div:not(:last-child)]:border-b">
                {expenses.map((expense) => (
                    <div
                        key={expense.id}
                        className="grid items-center grid-cols-[minmax(150px,1fr)_repeat(3,minmax(10px,1fr))_minmax(80px,1fr)] gap-y-0 gap-4 py-4 sm:py-2.5 text-gray-900 hover:bg-gray-100/50"
                    >
                        <div className="truncate text-gray-500">
                            {expense.name}
                        </div>
                        <div className=" text-gray-800">
                            ${expense.amount}
                        </div>
                        <div className="font-medium antialiased text-gray-900">
                            {expense.category.name}
                        </div>
                        <div className=" text-gray-500">
                            {expense.date.toLocaleDateString()}
                        </div>
                        <div className="flex justify-end sm:justify-center gap-x-5">
                            <Link
                                href={`/dashboard/expenses/${expense.id}`}
                                className="items-center justify-center inline-flex"
                            >
                                <PencilSquareIcon className="h-5 w-5 text-gray-500 hover:text-gray-800" />
                            </Link>
                            <button
                                onClick={() => open(expense.name, expense.id)}
                                className="items-center justify-center inline-flex"
                            >
                                <TrashIcon className="h-5 w-5 text-gray-500 hover:text-gray-800" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Dialog
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
                                Are you sure you want to delete the Expense for{" "}
                                <span className="text-black">{expenseName}</span>?
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
                                    onClick={handleDeleteExpense}
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

export default ExpensesTable;
