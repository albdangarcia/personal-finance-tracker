/**
 * Capitalizes the first letter of a given string and converts the rest to lowercase.
 *
 * @param {string} text - The string to be transformed.
 * @returns {string} - The transformed string with the first letter capitalized and the rest in lowercase.
 */
export const capitalizeFirstLetter = (text: string): string => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formats a given date object into MM/DD/YYYY format.
 *
 * @param {Date | null | undefined} date - The date object to format. If null or undefined, returns "N/A".
 * @returns {string} The formatted date string in MM/DD/YYYY format or "N/A" if the date is null or undefined.
 */
export const formatDate = (date: Date | null | undefined): string => {
    if (!date) return "N/A";
    const [year, month, day] = date.toISOString().split('T')[0].split('-');
    return `${month}/${day}/${year}`;
};