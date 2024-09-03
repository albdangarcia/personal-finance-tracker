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