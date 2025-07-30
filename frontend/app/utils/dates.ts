// Returns time slots from 09:00 to 17:00 in both 24-hour and 12-hour formats
export function getTimeSlotsInBothFormats() {
  const slots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let min of [0, 30]) {
      const time24 = `${hour.toString().padStart(2, '0')}:${min === 0 ? '00' : '30'}`;
      let hour12 = hour % 12 === 0 ? 12 : hour % 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const time12 = `${hour12}:${min === 0 ? '00' : '30'} ${ampm}`;
      slots.push({ time24, time12 });
    }
  }
  return slots;
} 