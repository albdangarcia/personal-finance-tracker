const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const user1 = {
  id: "clziqqbgy000108l7dmts0vng",
  name: "John Doe",
  email: "john.doe@example.com",
  password: "password123",
};

// const user2 = {
//   id: "clziqr73j000208l75sy3dldm",
//   name: "Jane Smith",
//   email: "jane.smith@example.com",
//   password: "password123",
// };

async function seedUsers() {
  console.log("Seeding users...");
  try {
    await prisma.user.createMany({
      data: [user1],
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
          startDate: new Date("2024-01-01"),
          userId: user1.id,
        }
      ],
    });
  } catch (error) {
    console.error("Error seeding regular incomes:", error);
    throw error;
  }
}

async function seedExpense() {
  console.log("Seeding expenses...");
  try {
    await prisma.expense.createMany({
      data: [
        {
          categoryId: "clzn1qih0000008l62z1r5cus",
          amount: 180,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1sjfo000108l6hk8t48z4",
          amount: 30,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1t6g6000208l68sy4a87y",
          amount: 50,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1uya9000308l63mz9cnqd",
          amount: 20,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1v4hf000508l673fm0oku",
          amount: 40,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1v9qs000608l6b6h23jt8",
          amount: 10,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1ve6r000708l69p99czkv",
          amount: 40,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1vjnb000808l6d351ajrw",
          amount: 20,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1vqi8000908l64ure8t1k",
          amount: 10,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1vv97000a08l6863rh49m",
          amount: 30,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1wtpi000b08l69dclc6oq",
          amount: 40,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1wzml000c08l6ewdth0zk",
          amount: 20,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1ykfe000d08l66g2sh8iw",
          amount: 10,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1yobw000e08l694zh9tg3",
          amount: 30,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1yspd000f08l67wjh5d0m",
          amount: 40,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1yym2000g08l61zfidl1g",
          amount: 20,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1z2bu000h08l69nb4dvva",
          amount: 10,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1z6qa000i08l6fklc577c",
          amount: 30,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1zbe1000j08l6gjabe0v6",
          amount: 20,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn1zess000k08l6hx0zggcb",
          amount: 10,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn217qn000o08l6fg2i2fyq",
          amount: 70,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn21b66000p08l6g6rn5zip",
          amount: 100,
          userId: user1.id,
          date: new Date("2024-01-15"),
        },
        {
          categoryId: "clzn21eq3000q08l6f974e4q9",
          amount: 10,
          userId: user1.id,
          date: new Date("2024-01-15"),
        }
      ],
    });
  } catch (error) {
    console.error("Error seeding expenses:", error);
    throw error;
  }
}

async function seedCategories() {
  console.log("Seeding categories...");
  try {
    await prisma.category.createMany({
      data: [
        {
          id: "clzn1qih0000008l62z1r5cus",
          name: "Restaurant",
        },
        {
          id: "clzn1sjfo000108l6hk8t48z4",
          name: "Groceries",
        },
        {
          id: "clzn1t6g6000208l68sy4a87y",
          name: "Shopping",
        },
        {
          id: "clzn1uya9000308l63mz9cnqd",
          name: "Entertainment",
        },
        {
          id: "clzn1v4hf000508l673fm0oku",
          name: "Transportation",
        },
        {
          id: "clzn1v9qs000608l6b6h23jt8",
          name: "Health & Fitness",
        },
        {
          id: "clzn1ve6r000708l69p99czkv",
          name: "Utilities",
        },
        {
          id: "clzn1vjnb000808l6d351ajrw",
          name: "Travel",
        },
        {
          id: "clzn1vqi8000908l64ure8t1k",
          name: "Education",
        },
        {
          id: "clzn1vv97000a08l6863rh49m",
          name: "Insurance",
        },
        {
          id: "clzn1wtpi000b08l69dclc6oq",
          name: "Phone",
        },
        {
          id: "clzn1wzml000c08l6ewdth0zk",
          name: "Internet",
        },
        {
          id: "clzn1ykfe000d08l66g2sh8iw",
          name: "Pets",
        },
        {
          id: "clzn1yobw000e08l694zh9tg3",
          name: "Gifts",
        },
        {
          id: "clzn1yspd000f08l67wjh5d0m",
          name: "Kids",
        },
        {
          id: "clzn1yym2000g08l61zfidl1g",
          name: "Investments",
        },
        {
          id: "clzn1z2bu000h08l69nb4dvva",
          name: "Charity",
        },
        {
          id: "clzn1z6qa000i08l6fklc577c",
          name: "Savings",
        },
        {
          id: "clzn1zbe1000j08l6gjabe0v6",
          name: "Miscellaneous",
        },
        {
          id: "clzn1zess000k08l6hx0zggcb",
          name: "Clothing",
        },
        {
          id: "clzn20svi000m08l6246xbqo7",
          name: "Rent",
        },
        {
          id: "clzn212yc000n08l64ahjevl2",
          name: "Mortgage",
        },
        {
          id: "clzn217qn000o08l6fg2i2fyq",
          name: "Home Services",
        },
        {
          id: "clzn21b66000p08l6g6rn5zip",
          name: "Auto & Transport",
        },
        {
          id: "clzn21eq3000q08l6f974e4q9",
          name: "Gas & Fuel",
        },
      ],
    });
  } catch (error) {
    console.error("Error seeding categories:", error);
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
          date: new Date("2024-02-15"),
          userId: user1.id,
        }
      ],
    });
  } catch (error) {
    console.error("Error seeding irregular incomes:", error);
    throw error;
  }
}

// async function seedFixedExpenses() {
//   console.log("Seeding fixed expenses...");
//   try {
//     await prisma.fixedExpense.createMany({
//       data: [
//         {
//           amount: 1000,
//           category: "rent",
//           frequency: "MONTHLY",
//           date: new Date("2024-01-01"),
//           userId: user1.id,
//         },
//         {
//           amount: 800,
//           category: "rent",
//           frequency: "MONTHLY",
//           date: new Date("2024-01-01"),
//           userId: user2.id,
//         },
//       ],
//     });
//   } catch (error) {
//     console.error("Error seeding fixed expenses:", error);
//     throw error;
//   }
// }

// async function seedVariableExpenses() {
//   console.log("Seeding variable expenses...");
//   try {
//     await prisma.variableExpense.createMany({
//       data: [
//         {
//           amount: 300,
//           category: "groceries",
//           date: new Date("2024-01-15"),
//           userId: user1.id,
//         },
//         {
//           amount: 200,
//           category: "groceries",
//           date: new Date("2024-01-15"),
//           userId: user2.id,
//         },
//       ],
//     });
//   } catch (error) {
//     console.error("Error seeding variable expenses:", error);
//     throw error;
//   }
// }

async function seedSavingsGoals() {
  console.log("Seeding savings goals...");
  try {
    await prisma.savingsGoal.createMany({
      data: [
        {
          amount: 5000,
          category: "vacation",
          userId: user1.id,
        }
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
    return { debt1 };
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
          dueDate: new Date("2024-03-01"),
          debtId: debt1.id,
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
          categoryId: "clzn1qih0000008l62z1r5cus",
          amount: 100,
          // expense: 180,
          userId: user1.id,
        },
        {
          categoryId: "clzn1sjfo000108l6hk8t48z4",
          amount: 100,
          // expense: 30,
          userId: user1.id,
        },
        {
          categoryId: "clzn1t6g6000208l68sy4a87y",
          amount: 100,
          // expense: 50,
          userId: user1.id,
        },
        {
          categoryId: "clzn1uya9000308l63mz9cnqd",
          amount: 100,
          // expense: 20,
          userId: user1.id,
        },
        {
          categoryId: "clzn1v4hf000508l673fm0oku",
          amount: 100,
          // expense: 40,
          userId: user1.id,
        },
        {
          categoryId: "clzn1v9qs000608l6b6h23jt8",
          amount: 100,
          // expense: 10,
          userId: user1.id,
        },
        {
          categoryId: "clzn1ve6r000708l69p99czkv",
          amount: 100,
          // expense: 40,
          userId: user1.id,
        },
        {
          categoryId: "clzn1vjnb000808l6d351ajrw",
          amount: 100,
          // expense: 20,
          userId: user1.id,
        },
        {
          categoryId: "clzn1vqi8000908l64ure8t1k",
          amount: 100,
          // expense: 10,
          userId: user1.id,
        },
        {
          categoryId: "clzn1vv97000a08l6863rh49m",
          amount: 100,
          // expense: 30,
          userId: user1.id,
        },
        {
          categoryId: "clzn1wtpi000b08l69dclc6oq",
          amount: 100,
          // expense: 40,
          userId: user1.id,
        },
        {
          categoryId: "clzn1wzml000c08l6ewdth0zk",
          amount: 100,
          // expense: 20,
          userId: user1.id,
        },
        {
          categoryId: "clzn1ykfe000d08l66g2sh8iw",
          amount: 100,
          // expense: 10,
          userId: user1.id,
        },
        {
          categoryId: "clzn1yobw000e08l694zh9tg3",
          amount: 100,
          // expense: 30,
          userId: user1.id,
        },
        {
          categoryId: "clzn1yspd000f08l67wjh5d0m",
          amount: 100,
          // expense: 40,
          userId: user1.id,
        },
        {
          categoryId: "clzn1yym2000g08l61zfidl1g",
          amount: 100,
          // expense: 20,
          userId: user1.id,
        },
        {
          categoryId: "clzn1z2bu000h08l69nb4dvva",
          amount: 100,
          // expense: 10,
          userId: user1.id,
        },
        {
          categoryId: "clzn1z6qa000i08l6fklc577c",
          amount: 100,
          // expense: 30,
          userId: user1.id,
        },
        {
          categoryId: "clzn1zbe1000j08l6gjabe0v6",
          amount: 100,
          // expense: 20,
          userId: user1.id,
        },
        {
          categoryId: "clzn1zess000k08l6hx0zggcb",
          amount: 100,
          // expense: 10,
          userId: user1.id,
        },
        {
          categoryId: "clzn217qn000o08l6fg2i2fyq",
          amount: 700,
          // expense: 70,
          userId: user1.id,
        },
        {
          categoryId: "clzn21b66000p08l6g6rn5zip",
          amount: 1000,
          // expense: 100,
          userId: user1.id,
        },
        {
          categoryId: "clzn21eq3000q08l6f974e4q9",
          amount: 100,
          // expense: 10,
          userId: user1.id,
        }
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
  await prisma.expense.deleteMany();
  // await prisma.variableExpense.deleteMany();
  // await prisma.fixedExpense.deleteMany();
  await prisma.irregularIncome.deleteMany();
  await prisma.regularIncome.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  // Seed data
  console.log("Start seeding ...");
  await seedCategories();
  await seedUsers();
  await seedRegularIncomes();
  await seedIrregularIncomes();
  await seedExpense();
  // await seedFixedExpenses();
  // await seedVariableExpenses();
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
