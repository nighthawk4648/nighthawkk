// export const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
//   };


import { format } from "date-fns";

export function formatDate(isoString) {
  return format(new Date(isoString), "MMMM d, yyyy");
}


// import { format } from "date-fns";

// export function formatDate(isoString) {
//   return format(new Date(isoString), "MMMM d, yyyy 'at' h:mm a");
// }