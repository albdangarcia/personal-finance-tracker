import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
// import prisma from "@/app/lib/prisma";

test.describe("Dashboard Page", () => {
    test.beforeEach(async ({ page }) => {
        // Log in before each test
        await page.goto("http://localhost:3000/login");
        await page.fill('input[name="email"]', "example@example.com");
        await page.fill('input[name="password"]', "AhRX8LioQKpMTg7");
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL("http://localhost:3000/dashboard");
    });

    test("should allow a user to create an income", async ({ page }) => {
        // Navigate to the Incomes page
        await page.click('a[href="/dashboard/incomes"]');
        await expect(page).toHaveURL("http://localhost:3000/dashboard/incomes");

        // Click the "New" button to create an income
        await page.click('a[href="/dashboard/incomes/create"].bg-blue-600');
        await expect(page).toHaveURL(
            "http://localhost:3000/dashboard/incomes/create"
        );

        // Fill in the income form
        await page.selectOption('select[name="categoryId"]', "Charity");
        await page.fill('input[name="amount"]', "9000");
        await page.fill('input[name="startDate"]', "2025-04-04");
        await page.fill('input[name="endDate"]', "2025-05-05");

        // Submit the form
        await page.click('button[type="submit"]');

        // Verify redirect
        await expect(page).toHaveURL("http://localhost:3000/dashboard/incomes");
    });

    test("should disable frequency and end date when income type is irregular", async ({
        page,
    }) => {
        // Navigate to the Incomes page
        await page.click('a[href="/dashboard/incomes"]');
        await expect(page).toHaveURL("http://localhost:3000/dashboard/incomes");

        // Click the "New" button to create an income
        await page.click('a[href="/dashboard/incomes/create"].bg-blue-600');
        await expect(page).toHaveURL(
            "http://localhost:3000/dashboard/incomes/create"
        );

        // Select "Irregular" as the income type
        await page.selectOption('select[name="incomeType"]', "IRREGULAR");

        // Verify that the frequency and end date fields are disabled
        const frequencyField = page.locator('select[name="frequency"]');
        const endDateField = page.locator('input[name="endDate"]');
        await expect(frequencyField).toBeDisabled();
        await expect(endDateField).toBeDisabled();
    });

    // test("should allow a user to create a budget", async ({ page }) => {
    //     // Navigate to the budgets page
    //     await page.click('a[href="/dashboard/budgets"]');
    //     await expect(page).toHaveURL("http://localhost:3000/dashboard/budgets");

    //     // Click the "New" button to create an income
    //     await page.click('a[href="/dashboard/budgets/create"].bg-blue-600');
    //     await expect(page).toHaveURL(
    //         "http://localhost:3000/dashboard/budgets/create"
    //     );

    //     // Fill in the income form
    //     await page.selectOption('select[name="categoryId"]', "Groceries");
    //     await page.fill('input[name="amount"]', "9000");
    //     await page.fill('input[name="yearMonth"]', "2025-02");

    //     // Submit the form
    //     await page.click('button[type="submit"]');

    //     // Verify redirect
    //     await expect(page).toHaveURL("http://localhost:3000/dashboard/budgets");
    // });

    test("should allow a user to create an expense", async ({ page }) => {
        // Navigate to the expenses page
        await page.click('a[href="/dashboard/expenses"]');
        await expect(page).toHaveURL(
            "http://localhost:3000/dashboard/expenses"
        );

        // Click the "New" button to create an expense
        await page.click('a[href="/dashboard/expenses/create"].bg-blue-600');
        await expect(page).toHaveURL(
            "http://localhost:3000/dashboard/expenses/create"
        );

        // Fill in the expense form
        await page.selectOption('select[name="categoryId"]', "Charity");
        await page.fill('input[name="name"]', "Pizza");
        await page.fill('input[name="amount"]', "45");
        await page.fill('input[name="date"]', "2025-05-05");

        // Submit the form
        await page.click('button[type="submit"]');

        // Verify redirect
        await expect(page).toHaveURL(
            "http://localhost:3000/dashboard/expenses"
        );
    });

    test("should allow a user to create an debt", async ({ page }) => {
        // Navigate to the debts page
        await page.click('a[href="/dashboard/debts"]');
        await expect(page).toHaveURL("http://localhost:3000/dashboard/debts");

        // Click the "New" button to create an debt
        await page.click('a[href="/dashboard/debts/create"].bg-blue-600');
        await expect(page).toHaveURL(
            "http://localhost:3000/dashboard/debts/create"
        );

        // Fill in the debt form
        await page.selectOption('select[name="categoryId"]', "Charity");
        await page.fill('input[name="name"]', "Pizza");
        await page.fill('input[name="amount"]', "45");
        await page.fill('input[name="interest"]', "2");

        // Submit the form
        await page.click('button[type="submit"]');

        // Verify redirect
        await expect(page).toHaveURL("http://localhost:3000/dashboard/debts");
    });
});
