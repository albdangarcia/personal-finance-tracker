"use client";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import Link from "next/link";

type BreadcrumbsType = {
    label: string;
    href: string;
};

const Breadcrumbs = ({ breadcrumbs }: { breadcrumbs: BreadcrumbsType[] }) => {
    return (
        <nav aria-label="Breadcrumb" className="mb-6 block">
            <ol className="flex text-xs font-medium gap-x-1">
                <li className="flex text-gray-400 gap-x-1 items-center">
                    <Link href="/">
                        <HomeIcon className="w-4 h-4" />
                    </Link>
                    <ChevronRightIcon className="w-4 h-4" />
                </li>
                {breadcrumbs.map((breadcrumb, index) => (
                    <li
                        key={breadcrumb.href}
                        aria-current={
                            index === breadcrumbs.length - 1 ? true : undefined
                        }
                        className={clsx(
                            "flex gap-x-1 text-gray-400 last:text-gray-700"
                        )}
                    >
                        <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                        {index < breadcrumbs.length - 1 && (
                            <ChevronRightIcon className="w-4 h-4" />
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
