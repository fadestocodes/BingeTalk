export const parseDept = (input) => {
    return input
    .toUpperCase()
    .replace(/&/g, '_AND_')
    .replace(/\s+/g, '_');
}
export const unparseDept = (input) => {
    if (!input) return '';
    
    // Replace _AND_ with &
    let result = input.replace(/_AND_/g, '&');
    
    // Replace remaining _ with space
    result = result.replace(/_/g, ' ');
  
    // Optional: capitalize first letter of each word
    result = result
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  
    return result;
  }
  