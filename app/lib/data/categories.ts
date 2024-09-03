import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prisma";
import { CategoryInfo } from "../interfaces";

/**
 * Fetches all categories from the database.
 * 
 * @returns {Promise<CategoryInfo[]>} - A promise that resolves to an array of category objects.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
const fetchCategories = async (): Promise<CategoryInfo[]> => {
    // Disable caching for this function
    noStore();

    // Fetch categories from the database using Prisma
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
            },
        });
        return categories;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        throw new Error("Failed to fetch categories.");
    }
}

export { fetchCategories }