import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/login");
    });

    test("should display the login page", async ({ page }) => {
        await expect(page).toHaveURL("http://localhost:3000/login");
        await expect(page.locator("h1")).toHaveText(
            "Welcome Back to Budgeting."
        );
        await expect(page.locator("p").nth(0)).toContainText(
            "Please enter your email and password to continue."
        );
    });

    test("should have a login form", async ({ page }) => {
        await expect(page.locator("form")).toBeVisible();
    });

    test("should display sign up link", async ({ page }) => {
        const signUpLink = page.locator("text=Sign up");
        await expect(signUpLink).toBeVisible();
        await expect(signUpLink).toHaveAttribute("href", "/signup");
    });

    test("should display provider login options if available", async ({
        page,
    }) => {
        if ((await page.locator("text=Sign in with").count()) > 0) {
            await expect(page.locator("text=Sign in with")).toBeVisible();
        }
    });

    test("should allow a user to log in", async ({ page }) => {
        await page.fill('input[name="email"]', "example@example.com");
        await page.fill('input[name="password"]', "AhRX8LioQKpMTg7");
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL("http://localhost:3000/dashboard");
    });
});
