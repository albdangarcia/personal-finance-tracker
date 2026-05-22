// Function to calculate a date string based on the current date and a given month offset
export const calculateDate = (num: number) => {
  const now = new Date(); // Get the current date
  let year = now.getFullYear(); // Extract the current year
  let month = now.getMonth(); // Extract the current month (0-11)

  month += num; // Add the month offset to the current month

  // Adjust the year and month if the month is less than 0
  while (month < 0) {
    month += 12;
    year--;
  }

  // Adjust the year and month if the month is greater than 11
  while (month > 11) {
    month -= 12;
    year++;
  }

  // Return the calculated date string in the format "YYYY-MM"
  return `${year}-${String(month + 1).padStart(2, "0")}`;
};