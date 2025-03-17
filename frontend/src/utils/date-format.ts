/**
 * Formats a Date object or string to a YYYY-MM-DD format for date inputs
 */
export const formatDateForInput = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  // If it's already a string, check if it's in valid format
  if (typeof date === 'string') {
    // Return the string if it appears to be in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    
    // Try to convert string to Date and then format
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split('T')[0];
    }
    return '';
  }
  
  // If it's a Date object, format it
  return date.toISOString().split('T')[0];
};
