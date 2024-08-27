"use client";
import { deleteContribution } from "@/app/lib/actions/contribution";
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
import { GoalWithContributions } from "@/app/lib/interfaces";

interface Props {
    savingsGoal: GoalWithContributions;
}

const ContributionsTable = ({ savingsGoal }: Props) => {
    // State to manage the dialog open/close
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [contributionName, setContributionName] = useState<string>("");
    const [contributionId, setContributionId] = useState<string>("");

    // Dialog open/close
    const open = (contribution: string, contributionId: string) => {
        setContributionId(contributionId);
        setContributionName(contribution);
        setIsOpen(true);
    };
    
    // Close dialog
    const close = () => {
        setIsOpen(false);
    };

    // Handle delete
    const handleDeleteContribution = async () => {
        if (!contributionId) {
            return;
        }
        try {
            await deleteContribution(contributionId, savingsGoal.id);
            close();
        } catch (error) {
            console.error("Failed to delete Contribution:", error);
            throw new Error("Failed to delete Contribution");
        }
    };

    return (
        <SectionWrapper>
            <SectionHeader
                title="Savings Goal"
                subtitle="Details of the savings goal."
            />
            <Table>
                {/* table headers */}
                <TableHeader columns="grid-cols-3">
                    <div className="">Savings Goal</div>
                    <div className="">Category</div>
                    <div className="">Target Amount</div>
                </TableHeader>
                {/* table contents */}
                <TableContents>
                    <TableRow columns="grid-cols-3">
                        <div className="text-gray-700">{savingsGoal.name}</div>
                        <div className="text-gray-700">{savingsGoal.category.name}</div>
                        <div className="text-gray-700">${savingsGoal.amount}</div>
                    </TableRow>
                </TableContents>
            </Table>

            {/* Divider */}
            <div className="mt-8 mb-10 border border-dashed border-gray-200" />

            {/* Contributions section */}
            <SectionHeader
                title="Contributions"
                subtitle="List of contributions made to this savings goal."
                buttonLink={`/dashboard/savings-goals/${savingsGoal.id}/contributions/create`}
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
                    {savingsGoal.contributions.map((contribution) => (
                        <TableRow columns="grid-cols-3" key={contribution.id}>
                            <div className="text-gray-500">
                                {contribution.date.toLocaleDateString()}
                            </div>
                            <div className="font-medium">${contribution.amount}</div>
                            <EditDeleteButtons
                                editLink={`/dashboard/savings-goals/${savingsGoal.id}/contributions/${contribution.id}`}
                                propName={contribution.amount.toString()}
                                propId={contribution.id}
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
                title="Contribution"
                itemName={"$" + contributionName}
                handleDelete={handleDeleteContribution}
            />
        </SectionWrapper>
    );
};
export default ContributionsTable;
