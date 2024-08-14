import Link from "next/link";
import { ReactNode } from "react";

// Typing children
type Props = { children: ReactNode }

const DashboardLayout = ({ children }: Props) => {
  return (
    <>
      <nav>
        <ul className="flex gap-x-5 font-medium">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/dashboard/budgets">Budgets</Link>
          </li>
          <li>
            <Link href="/dashboard/expenses">Expenses</Link>
          </li>
        </ul>
      </nav>
      {children}
    </>
  );
}

export default DashboardLayout;
