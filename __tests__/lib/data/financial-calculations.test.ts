import { describe, expect, it } from "@jest/globals";
import {
    groupAmountsByCategory,
    sumAmountsForMonth,
} from "@/app/lib/utils/financialCalculations";

describe("financial calculations", () => {
    it("adds amounts by category", () => {
        expect(
            groupAmountsByCategory([
                { categoryId: "food", amount: 24.5, category: { name: "Food" } },
                { categoryId: "food", amount: 10.5, category: { name: "Food" } },
                { categoryId: "rent", amount: 1200, category: { name: "Rent" } },
            ])
        ).toEqual([
            { categoryId: "food", categoryName: "Food", totalAmount: 35 },
            { categoryId: "rent", categoryName: "Rent", totalAmount: 1200 },
        ]);
    });

    it("sums budget expenses from the requested month only", () => {
        expect(
            sumAmountsForMonth(
                [
                    { amount: 40, yearMonth: "2026-03" },
                    { amount: 65.25, yearMonth: "2026-03" },
                    { amount: 200, yearMonth: "2026-02" },
                ],
                "2026-03"
            )
        ).toBe(105.25);
        expect(sumAmountsForMonth([], "2026-03")).toBe(0);
    });
});
