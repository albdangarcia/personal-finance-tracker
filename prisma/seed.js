const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = (num) => String(now.getMonth() + 1 + num).padStart(2, "0");

const userId = {
    id: "clziqqbgy000108l7dmts0vng",
};

async function seedUsers() {
    console.log("Seeding users...");
    try {
        const hashedPassword = await bcrypt.hash("password", 10);
        await prisma.user.create({
            data: {
                id: userId.id,
                name: "John Doe",
                email: "example@email.com",
                password: hashedPassword,
            },
        });
    } catch (error) {
        console.error("Error seeding users:", error);
        throw error;
    }
}

async function Incomes() {
    console.log("Seeding incomes...");
    try {
        await prisma.income.createMany({
            data: [
                {
                    amount: 5000,
                    categoryId: "clzn1yym2000g08l61zfidl1g",
                    frequency: "MONTHLY",
                    startDate: new Date(`${currentYear}-${currentMonth(0)}-01`),
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    incomeType: "REGULAR",
                    userId: userId.id,
                },
                {
                    amount: 400,
                    categoryId: "clzn1yym2000g08l61zfidl1g",
                    frequency: "MONTHLY",
                    startDate: new Date(`${currentYear}-${currentMonth(0)}-01`),
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    incomeType: "REGULAR",
                    userId: userId.id,
                },
                {
                    amount: 200,
                    categoryId: "cm0edf2o2000008jz6nsj6nwe",
                    startDate: new Date(`${currentYear}-${currentMonth(0)}-15`),
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    incomeType: "IRREGULAR",
                    userId: userId.id,
                },
                {
                    amount: 3400,
                    categoryId: "cm0edf2o2000008jz6nsj6nwe",
                    startDate: new Date(`${currentYear}-${currentMonth(0)}-15`),
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    incomeType: "IRREGULAR",
                    userId: userId.id,
                },
            ],
        });
    } catch (error) {
        console.error("Error seeding incomes:", error);
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
                    name: "Restaurant at McDonald's",
                    amount: 180,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    categoryId: "clzn1sjfo000108l6hk8t48z4",
                    name: "Groceries at Walmart",
                    amount: 30,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    categoryId: "clzn1t6g6000208l68sy4a87y",
                    name: "Shopping at Amazon",
                    amount: 50,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    categoryId: "clzn1uya9000308l63mz9cnqd",
                    name: "Entertainment at Netflix",
                    amount: 20,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    categoryId: "clzn1v4hf000508l673fm0oku",
                    name: "Transportation at Uber",
                    amount: 40,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    categoryId: "clzn1v9qs000608l6b6h23jt8",
                    name: "Health & Fitness at Gym",
                    amount: 10,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    categoryId: "clzn1ve6r000708l69p99czkv",
                    name: "Utilities at PG&E",
                    amount: 40,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    categoryId: "clzn1vjnb000808l6d351ajrw",
                    name: "Travel at Expedia",
                    amount: 20,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    categoryId: "clzn1vqi8000908l64ure8t1k",
                    name: "Education at Udemy",
                    amount: 10,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    categoryId: "clzn1vv97000a08l6863rh49m",
                    name: "Insurance at Geico",
                    amount: 30,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    categoryId: "clzn1wtpi000b08l69dclc6oq",
                    name: "Phone at AT&T",
                    amount: 40,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    categoryId: "clzn1wzml000c08l6ewdth0zk",
                    name: "Internet at Comcast",
                    amount: 20,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    categoryId: "clzn1ykfe000d08l66g2sh8iw",
                    name: "Pets at Petco",
                    amount: 10,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(-1)}`,
                    date: new Date(`${currentYear}-${currentMonth(-1)}-15`),
                },
                {
                    categoryId: "clzn1yobw000e08l694zh9tg3",
                    name: "Gifts at Amazon",
                    amount: 30,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(-1)}`,
                    date: new Date(`${currentYear}-${currentMonth(-1)}-15`),
                },
                {
                    categoryId: "clzn1yspd000f08l67wjh5d0m",
                    name: "Kids at Toys R Us",
                    amount: 40,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(-1)}`,
                    date: new Date(`${currentYear}-${currentMonth(-1)}-15`),
                },
                {
                    categoryId: "clzn1yym2000g08l61zfidl1g",
                    name: "Investments at Robinhood",
                    amount: 20,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(-2)}`,
                    date: new Date(`${currentYear}-${currentMonth(-2)}-15`),
                },
                {
                    categoryId: "clzn1z2bu000h08l69nb4dvva",
                    name: "Charity at Red Cross",
                    amount: 10,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(-2)}`,
                    date: new Date(`${currentYear}-${currentMonth(-2)}-15`),
                },
                {
                    categoryId: "clzn1z6qa000i08l6fklc577c",
                    name: "Savings at Bank of America",
                    amount: 30,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(-2)}`,
                    date: new Date(`${currentYear}-${currentMonth(-2)}-15`),
                },
                {
                    categoryId: "clzn1zbe1000j08l6gjabe0v6",
                    name: "Miscellaneous at Amazon",
                    amount: 20,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(-3)}`,
                    date: new Date(`${currentYear}-${currentMonth(-3)}-15`),
                },
                {
                    categoryId: "clzn1zess000k08l6hx0zggcb",
                    name: "Clothing at Macy's",
                    amount: 10,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(-3)}`,
                    date: new Date(`${currentYear}-${currentMonth(-3)}-15`),
                },
                {
                    categoryId: "clzn217qn000o08l6fg2i2fyq",
                    name: "Home Services at Home Depot",
                    amount: 70,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(-4)}`,
                    date: new Date(`${currentYear}-${currentMonth(-4)}-15`),
                },
                {
                    categoryId: "clzn21b66000p08l6g6rn5zip",
                    name: "Auto & Transport at Shell",
                    amount: 100,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(-4)}`,
                    date: new Date(`${currentYear}-${currentMonth(-4)}-15`),
                },
                {
                    categoryId: "clzn21eq3000q08l6f974e4q9",
                    name: "Gas & Fuel at Chevron",
                    amount: 10,
                    userId: userId.id,
                    yearMonth: `${currentYear}-${currentMonth(-4)}`,
                    date: new Date(`${currentYear}-${currentMonth(-4)}-15`),
                },
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
                {
                    id: "cm0bu5boh000008lb2ol28llt",
                    name: "Credit Card",
                },
                {
                    id: "cm0ede91d000108ky0khb8k9k",
                    name: "Job",
                },
                {
                    id: "cm0edf2o2000008jz6nsj6nwe",
                    name: "Freelance",
                },
            ],
        });
    } catch (error) {
        console.error("Error seeding categories:", error);
        throw error;
    }
}

async function seedSavingContributions() {
    console.log("Seeding contributions...");
    try {
        await prisma.contribution.createMany({
            data: [
                {
                    savingsGoalId: "clzu61h7d000108l251hzaezo",
                    amount: 100,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    savingsGoalId: "clzu61h7d000108l251hzaezo",
                    amount: 1000,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    savingsGoalId: "clzu61h7d000108l251hzaezo",
                    amount: 1000,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    savingsGoalId: "clzu61tyn000208l2gz9v3sg0",
                    amount: 2300,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    savingsGoalId: "clzu61tyn000208l2gz9v3sg0",
                    amount: 1000,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
                {
                    savingsGoalId: "clzu61tyn000208l2gz9v3sg0",
                    amount: 1000,
                    date: new Date(`${currentYear}-${currentMonth(0)}-15`),
                },
            ],
        });
    } catch (error) {
        console.error("Error seeding contributions:", error);
        throw error;
    }
}
async function seedSavingsGoals() {
    console.log("Seeding savings goals...");
    try {
        await prisma.savingsGoal.createMany({
            data: [
                {
                    id: "clzu61h7d000108l251hzaezo",
                    name: "Vacation to Hawaii",
                    amount: 5000,
                    categoryId: "clzn1vjnb000808l6d351ajrw",
                    userId: userId.id,
                },
                {
                    id: "clzu61tyn000208l2gz9v3sg0",
                    name: "Vacation to Europe",
                    amount: 1000,
                    categoryId: "clzn1vjnb000808l6d351ajrw",
                    userId: userId.id,
                },
                {
                    id: "clzu8v4dg000009jp3lctb3yd",
                    name: "Register for a course",
                    amount: 3000,
                    categoryId: "clzn1vqi8000908l64ure8t1k",
                    userId: userId.id,
                },
                {
                    id: "clzu8v8hu000109jp3jfmdm7x",
                    name: "Save for a new phone",
                    amount: 1000,
                    categoryId: "clzn1wtpi000b08l69dclc6oq",
                    userId: userId.id,
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
        await prisma.debt.createMany({
            data: [
                {
                    id: "cm0bu9nl5000108lba11t74s2",
                    name: "Student Loan",
                    amount: 2000,
                    categoryId: "clzn1vqi8000908l64ure8t1k",
                    interest: 5.0,
                    userId: userId.id,
                },
                {
                    id: "cm0bugqzr000308lb3zmg2vo3",
                    name: "Bank Credit Card",
                    amount: 3000,
                    categoryId: "cm0bu5boh000008lb2ol28llt",
                    interest: 2.0,
                    userId: userId.id,
                },
                {
                    id: "cm0mwf1up000108l8f8xnaydg",
                    name: "New phone",
                    amount: 1500,
                    categoryId: "clzn1wtpi000b08l69dclc6oq",
                    interest: 1.0,
                    userId: userId.id,
                },
            ],
        });
    } catch (error) {
        console.error("Error seeding debts:", error);
        throw error;
    }
}

async function seedDebtPayments() {
    console.log("Seeding debt payments...");
    try {
        await prisma.debtPayment.createMany({
            data: [
                {
                    amount: 200,
                    date: new Date(`${currentYear}-${currentMonth(0)}-1`),
                    debtId: "cm0bugqzr000308lb3zmg2vo3",
                },
                {
                    amount: 100,
                    date: new Date(`${currentYear}-${currentMonth(0)}-1`),
                    debtId: "cm0bu9nl5000108lba11t74s2",
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
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1sjfo000108l6hk8t48z4",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1t6g6000208l68sy4a87y",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1uya9000308l63mz9cnqd",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1v4hf000508l673fm0oku",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1v9qs000608l6b6h23jt8",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1ve6r000708l69p99czkv",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1vjnb000808l6d351ajrw",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1vqi8000908l64ure8t1k",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1vv97000a08l6863rh49m",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1wtpi000b08l69dclc6oq",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1wzml000c08l6ewdth0zk",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(0)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1ykfe000d08l66g2sh8iw",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(-1)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1yobw000e08l694zh9tg3",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(-1)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1yspd000f08l67wjh5d0m",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(-1)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1yym2000g08l61zfidl1g",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(-2)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1z2bu000h08l69nb4dvva",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(-2)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1z6qa000i08l6fklc577c",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(-2)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1zbe1000j08l6gjabe0v6",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(-3)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn1zess000k08l6hx0zggcb",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(-3)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn217qn000o08l6fg2i2fyq",
                    amount: 700,
                    yearMonth: `${currentYear}-${currentMonth(-4)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn21b66000p08l6g6rn5zip",
                    amount: 1000,
                    yearMonth: `${currentYear}-${currentMonth(-4)}`,
                    userId: userId.id,
                },
                {
                    categoryId: "clzn21eq3000q08l6f974e4q9",
                    amount: 100,
                    yearMonth: `${currentYear}-${currentMonth(-4)}`,
                    userId: userId.id,
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
    await prisma.contribution.deleteMany();
    await prisma.savingsGoal.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.income.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();

    // Seed data
    console.log("Start seeding ...");
    await seedCategories();
    await seedUsers();
    await Incomes();
    await seedExpense();
    await seedSavingsGoals();
    await seedSavingContributions();
    await seedDebts();
    await seedDebtPayments();
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
