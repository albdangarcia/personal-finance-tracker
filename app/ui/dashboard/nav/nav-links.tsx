"use client";
import Link from "next/link";
import {
    ArrowLeftStartOnRectangleIcon,
    HomeIcon,
    BanknotesIcon,
    CalculatorIcon,
    ChartPieIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/dashboard", label: "Dashboard", icon: ChartPieIcon },
    { href: "/dashboard/budgets", label: "Budgets", icon: ChartBarIcon },
    { href: "/dashboard/expenses", label: "Expenses", icon: CalculatorIcon },
    {
        href: "/dashboard/savings-goals",
        label: "Saving Goals",
        icon: BanknotesIcon,
    },
];

const NavLinks = () => {
    const pathname = usePathname();
    return (
        <nav className="flex-col flex-1 flex text-gray-700">
            <ul className="gap-y-7 flex-col flex-1 flex">
                <li>
                    <ul className="-mx-2 [&>li:not(:first-child)]:mt-2">
                        {navItems.map((item) => {
                            const IconName = item.icon;
                            return (
                                <li
                                    key={item.href}
                                    className={clsx(
                                        "group rounded-md hover:bg-gray-50 hover:text-gray-900",
                                        pathname === item.href &&
                                            "bg-gray-50 text-gray-900"
                                    )}
                                >
                                    <Link
                                        href={item.href}
                                        className="text-sm/6 p-2 rounded-md gap-x-3 flex font-semibold"
                                    >
                                        <IconName
                                            className={clsx(
                                                "w-6 h-6 text-gray-400/85 group-hover:text-gray-500",
                                                pathname === item.href && "text-gray-500"
                                            )}
                                        />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </li>
                <li className="-mx-6 mt-auto hover:bg-gray-50">
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
