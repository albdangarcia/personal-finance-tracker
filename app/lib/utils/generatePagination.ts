/**
 * Generates an array of page numbers to display in the pagination component.
 *
 * @param {number} currentPage - The current active page number.
 * @param {number} totalPages - The total number of pages available.
 * @returns {Array<number | string>} - An array of page numbers and ellipses to display in the pagination.
 *
 * The function follows these rules:
 * - If the total number of pages is 7 or less, display all pages without any ellipsis.
 * - If the current page is among the first 3 pages, show the first 3 pages, an ellipsis, and the last 2 pages.
 * - If the current page is among the last 3 pages, show the first 2 pages, an ellipsis, and the last 3 pages.
 * - If the current page is somewhere in the middle, show the first page, an ellipsis, the current page and its neighbors, another ellipsis, and the last page.
 */
const generatePagination = (
    currentPage: number,
    totalPages: number
): Array<number | string> => {
    // If the total number of pages is 7 or less,
    // display all pages without any ellipsis.
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // If the current page is among the first 3 pages,
    // show the first 3, an ellipsis, and the last 2 pages.
    if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages - 1, totalPages];
    }

    // If the current page is among the last 3 pages,
    // show the first 2, an ellipsis, and the last 3 pages.
    if (currentPage >= totalPages - 2) {
        return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // If the current page is somewhere in the middle,
    // show the first page, an ellipsis, the current page and its neighbors,
    // another ellipsis, and the last page.
    return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
    ];
};

export default generatePagination;
