

export const toPascalCase = (str) => {
return str
    .replace(/[^a-zA-Z0-9 ]/g, '') // Remove non-alphanumeric characters except spaces
    .split(' ') // Split words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(''); // Join words without spaces
};