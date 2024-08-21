/**
 * Generates a random color with controlled brightness.
 * 
 * @param {number} minBrightness - The minimum brightness value (0-255).
 * @returns {string} - A random color in hexadecimal format.
 */
const getRandomColor = (minBrightness: number = 0): string => {
    // Define the characters used in the color code
    const letters = "0123456789ABCDEF";
    
    // Initialize the color string with the hash symbol
    let color = "#";

    // Loop 6 times to generate a 6-digit hexadecimal color code
    for (let i = 0; i < 6; i++) {
        // Append a random character from the letters string to the color
        color += letters[Math.floor(Math.random() * 16)];
    }

    // Convert the color to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Ensure the color meets the minimum brightness requirement
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    // If the generated color does not meet the brightness requirement, 
    // the function calls itself recursively to generate a new color.
    if (brightness < minBrightness) {
        return getRandomColor(minBrightness);
    }

    return color;
};

export default getRandomColor;