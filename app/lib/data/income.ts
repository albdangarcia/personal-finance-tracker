import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import { GroupIncomes, IncomeById } from "../interfaces";

// Define the number of incomes per page
const INCOMES_PER_PAGE = 10;

const fetchFilteredIncomes = async (query: string, currentPage: number): Promise<GroupIncomes> => {
    // Disabled the cache
    noStore();

    // Calculate the offset
    const offset = (currentPage - 1) * INCOMES_PER_PAGE;

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
            skip: offset,
            take: INCOMES_PER_PAGE,
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

export { fetchFilteredIncomes, fetchIncomeById };
