import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import { DataByCategories, GroupIncomes, IncomeById } from "../interfaces";

const fetchFilteredIncomes = async (query: string): Promise<GroupIncomes> => {
    // Disabled the cache
    noStore();

    try {
        const categoriesWithincomes = await prisma.income.findMany({
            where: {
                category: {
                    name: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
            },
            select: {
                id: true,
                amount: true,
                frequency: true,
                startDate: true,
                endDate: true,
                yearMonth: true,
                incomeType: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        // Separate regular and irregular incomes
        const irregularIncomes = categoriesWithincomes.filter(
            (income) => income.incomeType === "IRREGULAR"
        );
        const regularIncomes = categoriesWithincomes.filter(
            (income) => income.incomeType === "REGULAR"
        );

        // Return the incomes
        return { regularIncomes, irregularIncomes };

    } catch (error) {
        throw new Error("Failed to fetch incomes.");
    }
};

const fetchIncomeById = async (id: string): Promise<IncomeById | null> => {
    // Disable the cache
    noStore();

    // Fetch the income by id
    try {
        const income = await prisma.income.findUnique({
            where: { id },
            select: {
                id: true,
                amount: true,
                frequency: true,
                startDate: true,
                endDate: true,
                yearMonth: true,
                incomeType: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return income;
    } catch (error) {
        throw new Error("Failed to fetch income by id.");
    }
}

const fetchIncomeByCategory = async () => {
    // Disable caching
    noStore();

    try {
        // Fetch incomes grouped by categoryId
        const incomes = await prisma.income.findMany({
            select: {
                categoryId: true,
                amount: true,
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        // Group by category and calculate the total amount for each category
        const groupByCategory = incomes.reduce<DataByCategories[]>(
            (accumulator, income) => {
                // Extract categoryId and categoryName
                const categoryId = income.categoryId;
                const categoryName = income.category.name;

                // Find if the category already exists in the accumulator
                const existingCategory = accumulator.find(
                    (item) => item.categoryId === categoryId
                );

                if (existingCategory) {
                    // If the category exists, add the amount to the total
                    existingCategory.totalAmount += income.amount;
                } else {
                    // If the category does not exist, create a new category entry
                    accumulator.push({
                        categoryId: categoryId,
                        categoryName: categoryName,
                        totalAmount: income.amount,
                    });
                }

                // Return the updated accumulator for the next iteration
                return accumulator;
            },
            [] // Initial value of the accumulator is an empty array
        );

        return groupByCategory;
    } catch (error) {
        console.error("Failed to fetch incomes by category:", error);
        throw new Error("Failed to fetch incomes by category.");
    }
};

export { fetchFilteredIncomes, fetchIncomeById, fetchIncomeByCategory };
