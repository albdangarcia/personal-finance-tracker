"use client";
import Link from "next/link";
import { useState } from "react";
import { deleteSavingsGoal } from "@/app/lib/actions/savings-goals";
import clsx from "clsx";
import DialogComponent from "../delete-dialog";
import EditDeleteButtons from "../edit-delete-buttons";
import { SectionHeader, SectionWrapper } from "../page-section-wrapper";

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
        <SectionWrapper>
            <SectionHeader
                title="Savings Goals"
                subtitle="All the savings goals you have added are listed here."
                buttonLink="/dashboard/savings-goals/create"
            />

            {/* table headers */}
            <div className="pl-3 border-b mt-1 gap-4 py-4 rounded-t-md text-sm font-medium grid grid-cols-[minmax(10px,2fr)_repeat(5,minmax(10px,1fr))]">
                <div className="">Name</div>
                <div className="">Target Amount</div>
                <div className="">Total Contributions</div>
                <div className="">Progress</div>
                <div>View Contributions</div>
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
                                    "items-center gap-y-0 gap-4 pl-3 py-4 text-gray-900 hover:bg-gray-100/50 grid grid-cols-[minmax(10px,2fr)_repeat(5,minmax(10px,1fr))]",
                                    category.savingsGoals.length > 1 &&
                                        index <
                                            category.savingsGoals.length - 1 &&
                                        "border-b border-gray-300/60"
                                )}
                            >
                                <p className="text-gray-900 font-medium">
                                    {goal.name}
                                    {(goal.totalContributions / goal.amount) *
                                        100 >
                                        100 && (
                                        <span className="ml-2 bg-green-300 sm:bg-white text-green-700 border border-green-500 text-xs px-1 py-0.5 rounded-full">
                                            <span className="hidden sm:inline">
                                                completed
                                            </span>
                                        </span>
                                    )}
                                </p>
                                <p className="text-gray-500">${goal.amount}</p>
                                <p className="text-gray-500">
                                    ${goal.totalContributions}
                                </p>
                                <p className="text-gray-500">
                                    {(goal.totalContributions / goal.amount) *
                                        100}
                                    %
                                </p>
                                <div>
                                    <Link
                                        href={`/dashboard/savings-goals/${goal.id}/contributions`}
                                        className="text-indigo-600 font-medium"
                                    >
                                        View Details
                                    </Link>
                                </div>
                                <EditDeleteButtons
                                    editLink={`/dashboard/savings-goals/${goal.id}`}
                                    propName={goal.name}
                                    propId={goal.id}
                                    open={open}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <DialogComponent
                isOpen={isOpen}
                close={close}
                title="Savings Goal"
                itemName={savingsGoalName}
                handleDelete={handleDeleteGoal}
                warnings="This action cannot be undone and all the contributions will be lost."
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
                                className="text-base/7 font-medium text-black"
                            >
                                Delete Saving Goal
                            </DialogTitle>
                            <p className="mt-2 text-sm/6 text-gray-600">
                                Are you sure you want to delete the Saving Goal{" "}
                                <span className="text-black">
                                    {savingsGoalName}
                                </span>
                                ?
                                <span className="block mt-2 text-xs/6 text-red-600">
                                    This action cannot be undone and all the
                                    contributions will be lost.
                                </span>
                            </p>
                            <div className="mt-4 flex gap-x-2 border-t pt-4">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-black py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-800 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
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
            </Dialog> */}
        </SectionWrapper>
    );
};

export default CategoriesTable;
