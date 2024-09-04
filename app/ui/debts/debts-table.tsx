"use client";
import Link from "next/link";
import { useState } from "react";
import { deleteDebt } from "@/app/lib/actions/debt";
import clsx from "clsx";
import DialogComponent from "../delete-dialog";
import EditDeleteButtons from "../edit-delete-buttons";
import { SectionHeader, SectionWrapper } from "../page-section-wrapper";
import SearchBar from "../search-bar";
import Pagination from "../pagination";
import { CategoriesWithDebts } from "@/app/lib/interfaces";

interface Props {
    categoriesWithDebts: CategoriesWithDebts[];
    totalPages: number;
}

const DebtsTable = ({ categoriesWithDebts, totalPages }: Props) => {
    // State to manage the dialog open/close
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [debtName, setDebtName] = useState<string>("");
    const [debtId, setDebtId] = useState<string>("");

    // Dialog open/close
    const open = (debt: string, debtId: string) => {
        setDebtId(debtId);
        setDebtName(debt);
        setIsOpen(true);
    };
    const close = () => {
        setIsOpen(false);
    };

    // Handle delete
    const handleDeleteDebt = async () => {
        if (!debtId) {
            return;
        }
        try {
            await deleteDebt(debtId);
            close();
        } catch (error) {
            console.error("Failed to delete Debt:", error);
            throw new Error("Failed to delete Debt");
        }
    };

    return (
        <SectionWrapper>
            <SectionHeader
                title="Debts"
                subtitle="All the debts you have added are listed here."
                buttonLink="/dashboard/debts/create"
            />

            {/* Search bar */}
            <div className="w-80 mt-1 mb-5">
                <SearchBar placeholder="Seach name" />
            </div>

            {/* table headers */}
            <div className="pl-3 border-b mt-1 gap-4 items-center py-4 rounded-t-md text-sm font-medium grid grid-cols-[minmax(10px,2fr)_repeat(6,minmax(10px,1fr))]">
                <div className="">Name</div>
                <div className="">Amount</div>
                <div className="">Total Payments</div>
                <div className="">Interest</div>
                <div className="">Progress</div>
                <div>View Payments</div>
                <div className="text-center sr-only">Edit</div>
            </div>

            {/* table contents */}
            <div className="text-sm">
                {categoriesWithDebts.map((category) => (
                    <div key={category.id}>
                        <div className="font-semibold text-gray-900 bg-[#F9FAFB] py-2.5 pl-3 border-y border-gray-300/60">
                            {category.name}
                        </div>
                        {category.debts.map((debt, index) => (
                            <div
                                key={debt.id}
                                className={clsx(
                                    "items-center gap-y-0 gap-4 pl-3 py-4 text-gray-900 hover:bg-gray-100/50 grid grid-cols-[minmax(10px,2fr)_repeat(6,minmax(10px,1fr))]",
                                    category.debts.length > 1 &&
                                        index < category.debts.length - 1 &&
                                        "border-b border-gray-300/60"
                                )}
                            >
                                <p className="text-gray-900 font-medium">
                                    {debt.name}
                                    {(debt.totalPayments / debt.amount) * 100 >
                                        100 && (
                                        <span className="ml-2 bg-green-300 sm:bg-white text-green-700 border border-green-500 text-xs px-1 py-0.5 rounded-full">
                                            <span className="hidden sm:inline">
                                                completed
                                            </span>
                                        </span>
                                    )}
                                </p>
                                <p className="text-gray-500">
                                    ${debt.amount.toLocaleString()}
                                </p>
                                <p className="text-gray-500">
                                    ${debt.totalPayments.toLocaleString()}
                                </p>
                                <p className="text-gray-500">
                                    {debt.interest}%
                                </p>
                                {/* Payment progress */}
                                <p className="text-gray-500">
                                    {Math.min(
                                        Math.round(
                                            (debt.totalPayments / debt.amount) *
                                                100
                                        ),
                                        100
                                    )}
                                    %
                                </p>
                                {/* View payments */}
                                <div>
                                    <Link
                                        href={`/dashboard/debts/${debt.id}/payments`}
                                        className="text-indigo-600 font-medium"
                                    >
                                        View Details
                                    </Link>
                                </div>
                                <EditDeleteButtons
                                    editLink={`/dashboard/debts/${debt.id}`}
                                    propName={debt.name}
                                    propId={debt.id}
                                    open={open}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Pagination buttons */}
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>

            {/* Dialog */}
            <DialogComponent
                isOpen={isOpen}
                close={close}
                title="Debt"
                itemName={debtName}
                handleDelete={handleDeleteDebt}
                warnings="This action cannot be undone and all the payments will be lost."
            />
        </SectionWrapper>
    );
};

export default DebtsTable;
