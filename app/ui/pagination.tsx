"use client";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import generatePagination from "@/app/lib/utils/generatePagination";
import { usePathname, useSearchParams } from "next/navigation";

type PaginationNumberProps = {
    page: number | string;
    href: string;
    position?: "first" | "last" | "middle" | "single";
    isActive: boolean;
};

// Number component for pagination.
const PaginationNumber = ({
    page,
    href,
    isActive,
    position,
}: PaginationNumberProps) => {
    // Determine the class name based on the position and active state.
    const className = clsx(
        "flex h-10 w-10 items-center justify-center text-sm border",
        (position === "first" || position === "single") && "rounded-l-md",
        position === "middle" && "text-gray-300",
        (position === "last" || position === "single") && "rounded-r-md",
        isActive && "z-10 bg-blue-600 border-blue-600 text-white",
        !isActive && position !== "middle" && "hover:bg-gray-100"
    );

    const pageButtonWithLink = (
        <Link href={href} className={className}>
            {page}
        </Link>
    );

    const pageButtonWithoutLink = <div className={className}>{page}</div>;

    // If the page is active or in the middle, don't make it a link.
    return isActive || position === "middle"
        ? pageButtonWithoutLink
        : pageButtonWithLink;
};

type PaginationArrowProps = {
    href: string;
    direction: "left" | "right";
    isDisabled?: boolean;
};

// Arrow component for pagination.
const PaginationArrow = ({
    href,
    direction,
    isDisabled,
}: PaginationArrowProps) => {
    // Determine the class name based on the direction and disabled state.
    const className = clsx(
        "flex h-10 w-10 items-center justify-center rounded-md border",
        isDisabled && "pointer-events-none text-gray-300",
        !isDisabled && "hover:bg-gray-100",
        direction === "left" && "mr-2 md:mr-4",
        direction === "right" && "ml-2 md:ml-4"
    );

    // Determine the icon based on the direction.
    const IconName = direction === "left" ? ArrowLeftIcon : ArrowRightIcon;

    // Arrow component with Link
    const arrowWithLink = (
        <Link className={className} href={href}>
            <IconName className="w-4" />
        </Link>
    );

    // Arrow component without Link
    const arrowWithoutLink = (
        <div className={className}>
            <IconName className="w-4" />
        </div>
    );

    // If the arrow is disabled, don't make it a link.
    return isDisabled ? arrowWithoutLink : arrowWithLink;
};

type PositionType = "first" | "last" | "single" | "middle" | undefined;

// Pagination component
const Pagination = ({ totalPages }: { totalPages: number }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    // Create a new URLSearchParams object from the current search params.
    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    // Generate the array of page numbers to display in the pagination.
    const pagesArray = generatePagination(currentPage, totalPages);

    return (
        <>
            <div className="inline-flex">
                {/* arrow on the left side */}
                <PaginationArrow
                    direction="left"
                    href={createPageURL(currentPage - 1)}
                    isDisabled={currentPage <= 1}
                />

                {/* pagination numbers */}
                <div className="flex -space-x-px">
                    {pagesArray.map((page, index) => {
                        
                        let position: PositionType;
                        
                        // Determine the position of the page number.
                        if (index === 0) position = "first";
                        if (index === pagesArray.length - 1) position = "last";
                        if (pagesArray.length === 1) position = "single";
                        if (page === "...") position = "middle";

                        return (
                            <PaginationNumber
                                key={page}
                                href={createPageURL(page)}
                                page={page}
                                position={position}
                                isActive={currentPage === page}
                            />
                        );
                    })}
                </div>

                {/* arrow on the right side */}
                <PaginationArrow
                    direction="right"
                    href={createPageURL(currentPage + 1)}
                    isDisabled={currentPage >= totalPages}
                />
            </div>
        </>
    );
};

export default Pagination;
