import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { main } from "@/prisma/seed";
import { isDemo } from "@/lib/flags";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // Hard exit if not a demo environment
  if (!isDemo) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  // Protect the endpoint with a secret key
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Starting demo database reset (Financial Models)...");

    // Wipe the database in the correct order to respect relations
    // Delete models that have foreign keys first
    console.log("Wiping existing financial data...");

    // Delete models that depend on other financial models
    await prisma.debtPayment.deleteMany({});
    await prisma.contribution.deleteMany({});
    await prisma.income.deleteMany({});
    await prisma.expense.deleteMany({});
    await prisma.budget.deleteMany({});

    // Delete models that are depended upon
    await prisma.debt.deleteMany({});
    await prisma.savingsGoal.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({}); // Delete the user last as all other models rely on it

    console.log("Database wiped.");

    // Run full seeding logic
    console.log("Seeding new data...");
    await main();
    console.log("Database has been successfully re-seeded.");

    return NextResponse.json({
      success: true,
      message: "Demo database reset successfully.",
    });
  } catch (error) {
    // Log the detailed error on the server
    console.error("Failed to reset demo database:", error);
    // Return a generic error message to the client
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}