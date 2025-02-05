/**
 * Returns the current date in the format "YYYY-MM-DD".
 * @returns {string} The current date in the format "YYYY-MM-DD".
 */
const getCurrentDate = (): string => {
    return new Date().toISOString().split("T")[0];
};

export default getCurrentDate;