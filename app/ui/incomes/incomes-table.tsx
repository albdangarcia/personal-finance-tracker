"use client";
import { useState } from "react";
import clsx from "clsx";
import DialogComponent from "../delete-dialog";
import EditDeleteButtons from "../edit-delete-buttons";
import { SectionHeader, SectionWrapper } from "../page-section-wrapper";
import SearchBar from "../search-bar";
import { GroupIncomes } from "@/app/lib/interfaces";
import { deleteIncome } from "@/app/lib/actions/income";

const IncomesTable = ({
    regularIncomes,
    irregularIncomes,
}: GroupIncomes) => {
    // State to manage the dialog open/close
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [incomeName, setIncomeName] = useState<string>("");
    const [incomeId, setIncomeId] = useState<string>("");

    // Dialog open/close
    const open = (income: string, incomeId: string) => {
        setIncomeId(incomeId);
        setIncomeName(income);
        setIsOpen(true);
    };

    // Close dialog
    const close = () => {
        setIsOpen(false);
    };

    // Handle delete
    const handleDeleteIncome = async () => {
        if (!incomeId) {
            return;
        }
        try {
            await deleteIncome(incomeId);
            close();
        } catch (error) {
            console.error("Failed to delete Income:", error);
            throw new Error("Failed to delete Income");
        }
    };

    return (
        <SectionWrapper>
            <SectionHeader
                title="Incomes"
                subtitle="All the Incomes you have added are listed here."
                buttonLink="/dashboard/incomes/create"
            />

            {/* Search bar */}
            <div className="w-80 mt-1 mb-5">
                <SearchBar placeholder="Seach category" />
            </div>

            {/* Regular incomes */}
            <div>
                {/* table headers */}
                <div className="pl-3 border-b mt-1 gap-4 items-center py-4 rounded-t-md text-sm font-medium grid grid-cols-6">
                    <div className="">Start Date</div>
                    <div className="">End Date</div>
                    <div className="">Amount</div>
                    <div className="">Frequency</div>
                    <div className="">Category</div>
                    <div className="text-center sr-only">Edit</div>
                </div>

                {/* table contents */}
                <div className="text-sm">
                    {/* Regular incomes */}
                    <div>
                        <div className="font-semibold text-gray-900 bg-[#F9FAFB] py-2.5 pl-3 border-y border-gray-300/60">
                            Regular Incomes
                        </div>
                        {regularIncomes.map((income, index) => (
                            <div
                                key={income.id}
                                className={clsx(
                                    "items-center gap-y-0 gap-4 pl-3 py-4 text-gray-900 hover:bg-gray-100/50 grid grid-cols-6",
                                    regularIncomes.length > 1 &&
                                        index < regularIncomes.length - 1 &&
                                        "border-b border-gray-300/60"
                                )}
                            >
                                <p className="text-gray-500">
                                    {income.startDate?.toLocaleDateString()}
                                </p>
                                <p className="text-gray-500">
                                    {income.endDate
                                        ? income.endDate?.toLocaleDateString()
                                        : "N/A"}
                                </p>
                                <p className="text-gray-900 font-medium">
                                    ${income.amount.toLocaleString()}
                                </p>
                                <p className="text-gray-500 lowercase first-letter:uppercase">
                                    {income.frequency}
                                </p>
                                <p className="text-gray-500">
                                    {income.category.name}
                                </p>
                                <EditDeleteButtons
                                    editLink={`/dashboard/incomes/${income.id}`}
                                    propName={income.amount.toString()}
                                    propId={income.id}
                                    open={open}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-[1px] border border-slate-300 border-dashed my-7" />

            {/* Irregular incomes */}
            <div>
                {/* table headers */}
                <div className="pl-3 border-b mt-1 gap-4 items-center py-4 rounded-t-md text-sm font-medium grid grid-cols-4">
                    <div className="">Start Date</div>
                    <div className="">Amount</div>
                    <div className="">Category</div>
                    <div className="text-center sr-only">Edit</div>
                </div>

                {/* table contents */}
                <div className="text-sm">
                    {/* Irregular incomes */}
                    <div>
                        <div className="font-semibold text-gray-900 bg-[#f9fafb] py-2.5 pl-3 border-y border-gray-300/60">
                            Irregular Incomes
                        </div>
                        {irregularIncomes.map((income, index) => (
                            <div
                                key={income.id}
                                className={clsx(
                                    "items-center gap-y-0 gap-4 pl-3 py-4 text-gray-900 hover:bg-gray-100/50 grid grid-cols-4",
                                    irregularIncomes.length > 1 &&
                                        index < irregularIncomes.length - 1 &&
                                        "border-b border-gray-300/60"
                                )}
                            >
                                <p className="text-gray-500">
                                    {income.startDate?.toLocaleDateString()}
                                </p>
                                <p className="text-gray-900 font-medium">
                                    ${income.amount.toLocaleString()}
                                </p>
                                <p className="text-gray-500">
                                    {income.category.name}
                                </p>
                                <EditDeleteButtons
                                    editLink={`/dashboard/incomes/${income.id}`}
                                    propName={income.amount.toString()}
                                    propId={income.id}
                                    open={open}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dialog */}
            <DialogComponent
                isOpen={isOpen}
                close={close}
                title="Delete Income"
                itemName={incomeName}
                handleDelete={handleDeleteIncome}
                warnings="This action cannot be undone."
            />
        </SectionWrapper>
    );
};

export default IncomesTable;
