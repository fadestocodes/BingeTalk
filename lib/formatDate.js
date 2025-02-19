import { format } from "date-fns";

export function getYear( date ){
    const year = new Date(date).getFullYear();
    return year
}


export const formatDate = ( date ) => {
    const newDate = new Date("2025-02-18T08:20:53.904Z");
    const formattedDate = format(date, "M/d/yyyy"); // Outputs: "02/18/2025"
    return formattedDate
}
