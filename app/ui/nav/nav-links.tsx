"use client";
import Link from "next/link";
import {
    ArrowLeftStartOnRectangleIcon,
    HomeIcon,
    BanknotesIcon,
    CalculatorIcon,
    ChartPieIcon,
    ChartBarIcon,
    PlusCircleIcon,
    InformationCircleIcon,
    QuestionMarkCircleIcon,
    ChatBubbleLeftEllipsisIcon,
    CreditCardIcon,
    CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const quickActionItems = [
    { href: "/dashboard/incomes/create", label: "Add Income" },
    { href: "/dashboard/budgets/create", label: "Add Budget" },
    { href: "/dashboard/expenses/create", label: "Add Expense" },
    { href: "/dashboard/debts/create", label: "Add Debt" },
    { href: "/dashboard/savings-goals/create", label: "Add Goal" },
];

const helpItems = [
    { href: "#", label: "Help Center", icon: QuestionMarkCircleIcon },
    { href: "#", label: "Contact Support", icon: InformationCircleIcon },
    { href: "#", label: "Send Feedback", icon: ChatBubbleLeftEllipsisIcon },
];

const navItems = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/dashboard", label: "Dashboard", icon: ChartPieIcon },
    { href: "/dashboard/incomes", label: "Incomes", icon: CurrencyDollarIcon },
    { href: "/dashboard/budgets", label: "Budgets", icon: ChartBarIcon },
    { href: "/dashboard/expenses", label: "Expenses", icon: CalculatorIcon },
    { href: "/dashboard/debts", label: "Debts", icon: CreditCardIcon },
    {
        href: "/dashboard/savings-goals",
        label: "Saving Goals",
        icon: BanknotesIcon,
    },
];

const NavLinks = () => {
    const pathname = usePathname();
    return (
        <nav className="flex-col flex-1 flex text-gray-900">
            <ul className="gap-y-7 flex-col flex-1 flex">
                <li>
                    <div className="text-slate-400 text-xs/6 font-semibold">
                        Navigation
                    </div>
                    <ul className="-mx-2">
                        {navItems.map((item) => {
                            const IconName = item.icon;
                            return (
                                <li
                                    key={item.href}
                                    className={clsx(
                                        "mt-1.5 group rounded-md hover:bg-slate-100 hover:text-blue-700",
                                        pathname === item.href &&
                                            "bg-slate-100 text-blue-700"
                                    )}
                                >
                                    <Link
                                        href={item.href}
                                        className="text-sm/6 p-2 rounded-md gap-x-3 flex font-semibold"
                                    >
                                        <IconName
                                            className={clsx(
                                                "w-6 h-6 text-gray-400/85 group-hover:text-blue-700",
                                                pathname === item.href &&
                                                    "text-blue-700"
                                            )}
                                        />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </li>

                {/* Quick actions */}
                <li>
                    <div className="text-slate-400 text-xs/6 font-semibold mb-2">
                        Quick Actions
                    </div>
                    <ul className="-mx-2">
                        {quickActionItems.map((item) => (
                            <li key={item.label} className="group text-slate-700 rounded-md hover:text-black">
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-2 text-xs/6 font-medium px-2 py-0.5 rounded-md"
                                >
                                    <PlusCircleIcon className="w-4 h-4 text-gray-400/85 group-hover:text-slate-600" />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>

                {/* help links */}
                <li>
                    <div className="text-slate-400 text-xs/6 font-semibold mb-2">
                        Help
                    </div>
                    <ul className="-mx-2">
                        {helpItems.map((item) => {
                            const IconName = item.icon;
                            return (
                            <li key={item.label} className="group text-slate-700 rounded-md hover:text-black">
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-2 text-xs/6 font-medium px-2 py-0.5 rounded-md"
                                >
                                    <IconName className="w-4 h-4 text-gray-400/85 group-hover:text-slate-600" />
                                    {item.label}
                                </Link>
                            </li>
                        )})}
                    </ul>
                </li>

                {/* Log out */}
                <li className="-mx-6 mt-auto hover:bg-slate-100">
                    <button className="flex gap-x-3 items-center font-semibold py-4 px-6 text-sm/6 w-full">
                        <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                        Log out
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default NavLinks;
