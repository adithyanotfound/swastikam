//date
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const day = currentDate.getDate();

//time
let hours = currentDate.getHours();
const minutes = currentDate.getMinutes();
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12; // Convert to 12-hour format
const dayNumber = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];



export const date = `${year}-${month}-${day}`;
export const dayName = daysOfWeek[dayNumber];
export const time = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;  // e.g., "2:30 PM"