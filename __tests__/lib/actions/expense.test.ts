import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const prismaMock = {
    category: { findUnique: jest.fn<(...args: never[]) => Promise<unknown>>() },
    expense: { create: jest.fn<(...args: never[]) => Promise<unknown>>() },
};
const getAuthenticatedUserIdMock = jest.fn<() => Promise<string>>();

jest.doMock("@/app/lib/prisma", () => ({ __esModule: true, default: prismaMock }));
jest.doMock("@/app/lib/utils/authUtils", () => ({
    getAuthenticatedUserId: getAuthenticatedUserIdMock,
}));
jest.doMock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.doMock("next/navigation", () => ({ redirect: jest.fn() }));

const { createExpense } = jest.requireActual("@/app/lib/actions/expense") as {
    createExpense: (previousState: object, formData: FormData) => Promise<unknown>;
};

describe("createExpense", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getAuthenticatedUserIdMock.mockResolvedValue("user-123");
    });

    it("returns amount and category validation errors without writing to the database", async () => {
        const formData = new FormData();
        formData.set("name", "Lunch");
        formData.set("amount", "0");
        formData.set("categoryId", "not-a-cuid");
        formData.set("date", "2026-03-15");

        const result = await createExpense({}, formData);

        expect(result).toMatchObject({
            errors: {
                amount: ["Please enter an amount greater than $0."],
                categoryId: ["Invalid CUID format."],
            },
            message: "Missing Fields. Failed to Create Expense.",
        });
        expect(prismaMock.category.findUnique).not.toHaveBeenCalled();
        expect(prismaMock.expense.create).not.toHaveBeenCalled();
    });
});
