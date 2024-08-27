"use client";
import EditDeleteButtons from "@/app/ui/edit-delete-buttons";
import { SectionWrapper, SectionHeader } from "@/app/ui/page-section-wrapper";
import {
    Table,
    TableHeader,
    TableContents,
    TableRow,
} from "@/app/ui/tables/simple-table";
import { useState } from "react";
import DialogComponent from "../delete-dialog";
import { DebtWithPayments } from "@/app/lib/interfaces";
import { deletePayment } from "@/app/lib/actions/debt-payment";

interface Props {
    debt: DebtWithPayments;
}

const PaymentsTable = ({ debt }: Props) => {
    // State to manage the dialog open/close
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [paymentName, setPaymentName] = useState<string>("");
    const [paymentId, setPaymentId] = useState<string>("");

    // Dialog open/close
    const open = (payment: string, paymentId: string) => {
        setPaymentId(paymentId);
        setPaymentName(payment);
        setIsOpen(true);
    };
    
    // Close dialog
    const close = () => {
        setIsOpen(false);
    };

    // Handle delete
    const handleDeletePayment = async () => {
        if (!paymentId) {
            return;
        }
        try {
            await deletePayment(paymentId, debt.id);
            close();
        } catch (error) {
            console.error("Failed to delete Payment:", error);
            throw new Error("Failed to delete Payment");
        }
    };

    return (
        <SectionWrapper>
            <SectionHeader
                title="Debt"
                subtitle="Details of the debt."
            />
            <Table>
                {/* table headers */}
                <TableHeader columns="grid-cols-4">
                    <div className="">Name</div>
                    <div className="">Amount</div>
                    <div className="">Interest Rate</div>
                    <div className="">Category</div>
                </TableHeader>
                {/* table contents */}
                <TableContents>
                    <TableRow columns="grid-cols-4">
                        <div className="text-gray-700">{debt.name}</div>
                        <div className="text-gray-700">${debt.amount.toLocaleString()}</div>
                        <div className="text-gray-700">{debt.interest}%</div>
                        <div className="text-gray-700">{debt.category.name}</div>
                    </TableRow>
                </TableContents>
            </Table>

            {/* Divider */}
            <div className="mt-8 mb-10 border border-dashed border-gray-200" />

            {/* Payment section */}
            <SectionHeader
                title="Payments"
                subtitle="List of payments made to this debt."
                buttonLink={`/dashboard/debts/${debt.id}/payments/create`}
            />
            <Table>
                {/* table headers */}
                <TableHeader columns="grid-cols-3">
                    <div className="">Date</div>
                    <div className="">Amount</div>
                    <div className="text-center sr-only">Edit</div>
                </TableHeader>
                {/* table contents */}
                <TableContents>
                    {debt.payments.map((payment) => (
                        <TableRow columns="grid-cols-3" key={payment.id}>
                            <div className="text-gray-500">
                                {payment.date.toLocaleDateString()}
                            </div>
                            <div className="font-medium">${payment.amount.toLocaleString()}</div>
                            <EditDeleteButtons
                                editLink={`/dashboard/debts/${debt.id}/payments/${payment.id}`}
                                propName={payment.amount.toString()}
                                propId={payment.id}
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
                title="Payment"
                itemName={"$" + paymentName}
                handleDelete={handleDeletePayment}
            />
        </SectionWrapper>
    );
};
export default PaymentsTable;
