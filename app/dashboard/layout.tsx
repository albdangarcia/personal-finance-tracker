import Link from "next/link";
import { ReactNode } from "react";

// Typing children
type Props = { children: ReactNode };

const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/budgets", label: "Budgets" },
    { href: "/dashboard/expenses", label: "Expenses" },
    { href: "/dashboard/savings-goals", label: "Saving Goals" },
];

const DashboardLayout = ({ children }: Props) => {
    return (
        <>
            <nav>
                <ul className="flex gap-x-5 font-medium">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href}>{item.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
            {children}
        </>
    );
};

export default DashboardLayout;
