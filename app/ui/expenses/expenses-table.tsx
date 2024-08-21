"use client";
import { useState } from "react";
import { deleteExpense } from "@/app/lib/actions/expense";
import { SectionWrapper, SectionHeader } from "../page-section-wrapper";
import {
    Table,
    TableHeader,
    TableContents,
    TableRow,
} from "../tables/simple-table";
import EditDeleteButtons from "../edit-delete-buttons";
import DialogComponent from "../delete-dialog";
import Pagination from "../pagination";
import SearchBar from "../search-bar";

type ExpensesProps = {
    totalPages: number;
    expenses: {
        id: string;
        name: string;
        amount: number;
        category: {
            id: string;
            name: string;
        };
        date: Date;
    }[];
};

const ExpensesTable = ({ expenses, totalPages }: ExpensesProps) => {
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
        try {
            await deleteExpense(expenseId);
            close();
        } catch (error) {
            console.error("Failed to delete Expense:", error);
            throw new Error("Failed to delete Expense");
        }
    };

    return (
        <SectionWrapper>
            <SectionHeader
                title="Expenses"
                subtitle="All the expenses you have added are listed here."
                buttonLink="/dashboard/expenses/create"
            />
            
            {/* Search bar */}
            <div className="w-80 mt-3 mb-5">
                <SearchBar placeholder="Seach name" />
            </div>

            <Table>
                {/* table headers */}
                <TableHeader columns="grid-cols-5">
                    <div className="">Name</div>
                    <div className="">Amount</div>
                    <div className="">Category</div>
                    <div className="">Date</div>
                    <div className=" text-center sr-only">Edit</div>
                </TableHeader>

                {/* table contents */}
                <TableContents>
                    {expenses.map((expense) => (
                        <TableRow columns="grid-cols-5" key={expense.id}>
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
                            <EditDeleteButtons
                                editLink={`/dashboard/expenses/${expense.id}`}
                                propName={expense.name}
                                propId={expenseId}
                                open={open}
                            />
                        </TableRow>
                    ))}
                </TableContents>
            </Table>

            {/* Pagination buttons */}
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>

            {/* Dialog */}
            <DialogComponent
                isOpen={isOpen}
                close={close}
                title="Expense"
                itemName={expenseName}
                handleDelete={handleDeleteExpense}
            />
        </SectionWrapper>
    );
};

export default ExpensesTable;
