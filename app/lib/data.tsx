import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";

export async function fetchAvailableCategories() {
  noStore();
  // Fetch categories that do not have a budget
  try {
    const categories = await prisma.category.findMany({
      where: {
        budget: {
          is: null, // Ensures that only categories without a budget are returned
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    // Return the categories
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories.");
  }
}

// Fetch all categories with budget and ignore the other categories
export async function fetchUsedCategoryWithBudget() {
  noStore();
  // Fetch all categories with a budget
  try {
    const categoriesWithBudget = await prisma.category.findMany({
      where: {
        budget: {
          isNot: null, // Ensures that only categories with a budget are returned
        },
      },
      select: {
        name: true,
        budget: {
          select: {
            id: true,
            allocation: true,
          },
        },
        expenses: {
          select: {
            amount: true,
          },
        },
      },
    });

    // Add totalExpenses property to each category
    const categoriesWithTotalExpenses = categoriesWithBudget.map((category) => {
      const totalExpenses = category.expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      return {
        ...category,
        totalExpenses,
      };
    });

    // Calculate the difference between allocation and total expenses, and sort by this difference
    const sortedCategories = categoriesWithTotalExpenses.sort((a, b) => {
      const aDifference = (a.budget?.allocation ?? 0) - a.totalExpenses;
      const bDifference = (b.budget?.allocation ?? 0) - b.totalExpenses;
      return aDifference - bDifference;
    });

    // Return the sorted categories
    return sortedCategories;
  } catch (error) {
    console.error("Failed to fetch Category with Budgets:", error);
    throw new Error("Failed to fetch Category with Budgets.");
  }
}

export async function fetchBudgetById(id: string) {
  noStore();
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        allocation: true,
      },
    });
    return budget;
  } catch (error) {
    console.error("Failed to fetch budget:", error);
    throw new Error("Failed to fetch budget.");
  }
}
