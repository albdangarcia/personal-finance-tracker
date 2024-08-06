const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const user1 = {
  id: "clziqqbgy000108l7dmts0vng",
  name: "John Doe",
  email: "john.doe@example.com",
  password: "password123",
};

const user2 = {
  id: "clziqr73j000208l75sy3dldm",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  password: "password123",
};

async function seedUsers() {
  console.log("Seeding users...");
  try {
    await prisma.user.createMany({
      data: [user1, user2],
    });
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function seedRegularIncomes() {
  console.log("Seeding regular incomes...");
  try {
    await prisma.regularIncome.createMany({
      data: [
        {
          amount: 5000,
          source: "Job",
          frequency: "MONTHLY",
          startDate: new Date("2023-01-01"),
          userId: user1.id,
        },
        {
          amount: 3000,
          source: "Job",
          frequency: "MONTHLY",
          startDate: new Date("2023-01-01"),
          userId: user2.id,
        },
      ],
    });
  } catch (error) {
    console.error("Error seeding regular incomes:", error);
    throw error;
  }
}

async function seedIrregularIncomes() {
  console.log("Seeding irregular incomes...");
  try {
    await prisma.irregularIncome.createMany({
      data: [
        {
          amount: 200,
          source: "Freelance",
          date: new Date("2023-02-15"),
          userId: user1.id,
        },
        {
          amount: 500,
          source: "Bonus",
          date: new Date("2023-03-10"),
          userId: user2.id,
        },
      ],
    });
  } catch (error) {
    console.error("Error seeding irregular incomes:", error);
    throw error;
  }
}

async function seedFixedExpenses() {
  console.log("Seeding fixed expenses...");
  try {
    await prisma.fixedExpense.createMany({
      data: [
        {
          amount: 1000,
          category: "rent",
          frequency: "MONTHLY",
          date: new Date("2023-01-01"),
          userId: user1.id,
        },
        {
          amount: 800,
          category: "rent",
          frequency: "MONTHLY",
          date: new Date("2023-01-01"),
          userId: user2.id,
        },
      ],
    });
  } catch (error) {
    console.error("Error seeding fixed expenses:", error);
    throw error;
  }
}

async function seedVariableExpenses() {
  console.log("Seeding variable expenses...");
  try {
    await prisma.variableExpense.createMany({
      data: [
        {
          amount: 300,
          category: "groceries",
          date: new Date("2023-01-15"),
          userId: user1.id,
        },
        {
          amount: 200,
          category: "groceries",
          date: new Date("2023-01-15"),
          userId: user2.id,
        },
      ],
    });
  } catch (error) {
    console.error("Error seeding variable expenses:", error);
    throw error;
  }
}

async function seedSavingsGoals() {
  console.log("Seeding savings goals...");
  try {
    await prisma.savingsGoal.createMany({
      data: [
        {
          amount: 5000,
          category: "vacation",
          userId: user1.id,
        },
        {
          amount: 3000,
          category: "new car",
          userId: user2.id,
        },
      ],
    });
  } catch (error) {
    console.error("Error seeding savings goals:", error);
    throw error;
  }
}

async function seedDebts() {
  console.log("Seeding debts...");
  try {
    const debt1 = await prisma.debt.create({
      data: {
        amount: 10000,
        category: "student loan",
        interest: 5.0,
        userId: user1.id,
      },
    });
    const debt2 = await prisma.debt.create({
      data: {
        amount: 5000,
        category: "credit card",
        interest: 20.0,
        userId: user2.id,
      },
    });
    return { debt1, debt2 };
  } catch (error) {
    console.error("Error seeding debts:", error);
    throw error;
  }
}

async function seedDebtPayments(debt1, debt2) {
  console.log("Seeding debt payments...");
  try {
    await prisma.debtPayment.createMany({
      data: [
        {
          amount: 200,
          dueDate: new Date("2023-03-01"),
          debtId: debt1.id,
        },
        {
          amount: 100,
          dueDate: new Date("2023-03-15"),
          debtId: debt2.id,
        },
      ],
    });
  } catch (error) {
    console.error("Error seeding debt payments:", error);
    throw error;
  }
}

async function seedBudgets() {
  console.log("Seeding budgets...");
  try {
    await prisma.budget.createMany({
      data: [
        {
          frequency: "MONTHLY",
          allocation: 3000,
          userId: user1.id,
        },
        {
          frequency: "MONTHLY",
          allocation: 2000,
          userId: user2.id,
        },
      ],
    });
  } catch (error) {
    console.error("Error seeding budgets:", error);
    throw error;
  }
}

async function main() {
  // Clear existing data
  console.log("Deleting existing data ...");
  await prisma.budget.deleteMany();
  await prisma.debtPayment.deleteMany();
  await prisma.debt.deleteMany();
  await prisma.savingsGoal.deleteMany();
  await prisma.variableExpense.deleteMany();
  await prisma.fixedExpense.deleteMany();
  await prisma.irregularIncome.deleteMany();
  await prisma.regularIncome.deleteMany();
  await prisma.user.deleteMany();

  // Seed data
  console.log("Start seeding ...");
  await seedUsers();
  await seedRegularIncomes();
  await seedIrregularIncomes();
  await seedFixedExpenses();
  await seedVariableExpenses();
  await seedSavingsGoals();
  // await seedDebts();
  const { debt1, debt2 } = await seedDebts();
  await seedDebtPayments(debt1, debt2);
  await seedBudgets();
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
