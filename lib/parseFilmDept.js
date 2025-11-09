export const parseDept = (input) => {
    return input
    .toUpperCase()
    .replace(/&/g, '_AND_')
    .replace(/\s+/g, '_');
}