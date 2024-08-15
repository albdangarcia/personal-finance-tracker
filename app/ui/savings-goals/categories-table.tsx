"use client";
import {
    PencilSquareIcon,
    TrashIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { deleteSavingsGoal } from "@/app/lib/actions/savings-goals";
import clsx from "clsx";

type Props = {
    savingsGoals: {
        totalContributions: number;
        id: string;
        name: string;
        amount: number;
        contributions: {
            amount: number;
        }[];
    }[];
    id: string;
    name: string;
};

const CategoriesTable = ({
    categoriesWithGoals,
}: {
    categoriesWithGoals: Props[];
}) => {
    // State to manage the dialog open/close
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [savingsGoalName, setSavingsGoalName] = useState<string>("");
    const [savingGoalId, setSavingGoalId] = useState<string>("");

    // Dialog open/close
    const open = (savingsGoal: string, savingsGoalId: string) => {
        setSavingGoalId(savingsGoalId);
        setSavingsGoalName(savingsGoal);
        setIsOpen(true);
    };
    const close = () => {
        setIsOpen(false);
    };

    // Handle delete
    const handleDeleteGoal = async () => {
        if (!savingGoalId) {
            return;
        }
        try {
            await deleteSavingsGoal(savingGoalId);
            close();
        } catch (error) {
            console.error("Failed to delete Savings Goal:", error);
            throw new Error("Failed to delete Savings Goal");
        }
    };

    return (
        <div className="antialiased mt-6 bg-white border border-gray-200 rounded-md shadow-sm pb-4 pt-10 px-8">
            <div className="flex justify-between">
                <div>
                    <h4 className="font-medium">Savings Goals</h4>
                    <p className="mt-2.5 mb-5 text-sm text-gray-600">
                        All the savings goals you have added are listed here.
                    </p>
                </div>
                <Link
                    href="/dashboard/savings-goals/create"
                    className="bg-blue-600 rounded flex h-9 w-9 text-white justify-center items-center hover:bg-blue-700"
                >
                    <PlusIcon className="h-5 w-5" />
                </Link>
            </div>

            {/* table headers */}
            <div className="pl-3 border-b mt-1 gap-4 py-4 rounded-t-md text-sm font-medium grid grid-cols-5">
                <div className="">Name</div>
                <div className="">Target Amount</div>
                <div className="">Total Contributions</div>
                <div className="">Progress</div>
                <div className="text-center sr-only">Edit</div>
            </div>

            {/* table contents */}
            <div className="text-sm">
                {categoriesWithGoals.map((category) => (
                    <div key={category.id}>
                        <div className="font-semibold text-gray-900 bg-[#F9FAFB] py-2.5 pl-3 border-y border-gray-300/60">
                            {category.name}
                        </div>
                        {category.savingsGoals.map((goal, index) => (
                            <div
                                key={goal.id}
                                className={clsx(
                                    "grid items-center grid-cols-5 gap-y-0 gap-4 pl-3 py-4 text-gray-900 hover:bg-gray-100/50",
                                    category.savingsGoals.length > 1 &&
                                        index <
                                            category.savingsGoals.length - 1 &&
                                        "border-b border-gray-300/60"
                                )}
                            >
                                <p className="text-gray-900 font-medium">
                                    {goal.name}
                                </p>
                                <p className="text-gray-500">${goal.amount}</p>
                                <p className="text-gray-500">
                                    ${goal.totalContributions}
                                </p>
                                <p className="text-gray-500">
                                    {(goal.totalContributions / goal.amount) *
                                        100}
                                    %
                                    {(goal.totalContributions / goal.amount) *
                                        100 >
                                        100 && (
                                        <span className="ml-2 bg-green-300 sm:bg-white text-green-700 border border-green-500 text-xs px-1 py-0.5 rounded-full">
                                            <span className="hidden sm:inline">completed</span>
                                        </span>
                                    )}
                                </p>
                                <div className="flex sm:justify-center gap-x-5">
                                    <Link
                                        href={`/dashboard/savings-goals/${goal.id}`}
                                        className="items-center justify-center inline-flex"
                                    >
                                        <PencilSquareIcon className="h-5 w-5 text-gray-500 hover:text-gray-800" />
                                    </Link>
                                    <button
                                        onClick={() =>
                                            open(goal.name, goal.id)
                                        }
                                        className="items-center justify-center inline-flex"
                                    >
                                        <TrashIcon className="h-5 w-5 text-gray-500 hover:text-gray-800" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <Dialog
                open={isOpen}
                as="div"
                className="relative z-10 focus:outline-none"
                onClose={close}
            >
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 bg-gray-200/55">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/25 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            <DialogTitle
                                as="h3"
                                className="text-base/7 font-medium text-black"
                            >
                                Delete Saving Goal
                            </DialogTitle>
                            <p className="mt-2 text-sm/6 text-black/80">
                                Are you sure you want to delete the Saving Goal {" "}
                                "{savingsGoalName}"? 
                                <p className="text-xs/6 text-red-600">This action cannot be undone and all the contributions will be lost.</p>
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
                                    onClick={handleDeleteGoal}
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

export default CategoriesTable;
