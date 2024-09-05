// Get current date
/**
 * Function to get the current year and month in the format YYYY-MM.
 * @returns {string} The current year and month as a string in the format YYYY-MM.
 */
const getCurrentYearMonth = (): string => {
    // Create a new Date object representing the current date and time
    const currentDate = new Date();
    
    // Extract the current year from the Date object
    const currentYear = currentDate.getFullYear();

    // Extract the current month from the Date object
    // Note: getMonth() returns a zero-based month (0 for January, 1 for February, etc.)
    // Adding 1 to get the correct month number and padding with leading zero if necessary
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    
    // Return the current year and month in the format YYYY-MM
    return `${currentYear}-${currentMonth}`;
};

export default getCurrentYearMonth;