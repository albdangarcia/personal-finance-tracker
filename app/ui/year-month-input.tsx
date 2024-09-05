"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import getCurrentYearMonth from "../lib/utils/currentYearMonth";
import { YearMonthSchema } from "../lib/zod-schemas";

const YearMonthInput = () => {
    // Hook to get the current URL search parameters
    const searchParams = useSearchParams();

    // Hook to get the current pathname
    const pathname = usePathname();

    // Destructure the replace function from the useRouter hook
    const { replace } = useRouter();

    const handleYearMonthChange = (value: string) => {
        // Validate the value against the schema
        const validation = YearMonthSchema.safeParse(value);
        if (!validation.success) {
            return;
        }

        // Get url params
        const params = new URLSearchParams(searchParams);

        // Split the value into year and month
        const [year, month] = value.split("-");

        // Set the year and month in the URL params
        params.set("year", year);
        params.set("month", month);

        // Replace the URL with the new params
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div>
            <label htmlFor="yearMonth" className="sr-only">
                Month Year
            </label>
            <input
                min="2024-01"
                defaultValue={getCurrentYearMonth()}
                id="yearMonth"
                name="yearMonth"
                type="month"
                required
                onChange={(e) => handleYearMonthChange(e.target.value)}
                className="block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2"
            />
        </div>
    );
};

export default YearMonthInput;
