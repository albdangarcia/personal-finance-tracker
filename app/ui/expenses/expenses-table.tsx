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
            {/* Dialog */}
            <DialogComponent
                isOpen={isOpen}
                close={close}
                title="Expense"
                itemName={expenseName}
                handleDelete={handleDeleteExpense}
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
                                Are you sure you want to delete the Expense for{" "}
                                <span className="text-black">
                                    {expenseName}
                                </span>
                                ?
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
            </Dialog> */}
        </SectionWrapper>
    );
};

export default ExpensesTable;
