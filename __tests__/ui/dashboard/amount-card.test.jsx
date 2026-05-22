import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TotalAmountCard from "../../../app/ui/dashboard/amount-card";

// Mock icon component
const MockIcon = (props) => <svg {...props}>mock-icon</svg>;

describe("TotalAmountCard", () => {
    const defaultProps = {
        title: "Total Revenue",
        total: 50000,
        percentageChange: 12,
        icon: MockIcon,
    };

    it("renders basic component structure", () => {
        render(<TotalAmountCard {...defaultProps} />);
        expect(screen.getByText("Total Revenue")).toBeInTheDocument();
        expect(screen.getByText("$")).toBeInTheDocument();
        expect(screen.getByText("50,000")).toBeInTheDocument();
        expect(screen.getByText("mock-icon")).toBeInTheDocument();
    });

    it("renders positive percentage with correct styling", () => {
        render(<TotalAmountCard {...defaultProps} />);
        const percentageElement = screen.getByTestId("percentage-change");
        expect(percentageElement).toHaveTextContent("+12%");
        expect(percentageElement).toHaveClass("bg-green-200", "text-green-700");
    });

    it("renders negative percentage with correct styling", () => {
        render(<TotalAmountCard {...defaultProps} percentageChange={-12} />);
        const percentageElement = screen.getByTestId("percentage-change");
        expect(percentageElement).toHaveTextContent("-12%");
        expect(percentageElement).toHaveClass("bg-red-200", "text-red-700");
    });

    it("formats large numbers correctly", () => {
        render(<TotalAmountCard {...defaultProps} total={1234567} />);
        expect(screen.getByText("1,234,567")).toBeInTheDocument();
    });
});