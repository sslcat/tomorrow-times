export const editorialZone = () => process.env.EDITORIAL_TIME_ZONE || 'America/Chicago';
export function localDateParts(instant: Date, zone = editorialZone()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(instant);
  const get = (name: string) => Number(parts.find(p => p.type === name)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}
export const isLeap = (year: number) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
export function fictionalDate(instant = new Date(), zone = editorialZone()): string {
  const { year, month, day } = localDateParts(instant, zone);
  const shifted = year + 1000;
  // Clamp February 29 to February 28 if the destination calendar has no leap day.
  const shiftedDay = month === 2 && day === 29 && !isLeap(shifted) ? 28 : day;
  return `${shifted}-${String(month).padStart(2, '0')}-${String(shiftedDay).padStart(2, '0')}`;
}
export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}
export function displayDate(value: string, long = false): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: long ? 'long' : 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00Z`));
}
export function ageOn(birthDate: string, date: string) {
  return Number(date.slice(0, 4)) - Number(birthDate.slice(0, 4)) - (date.slice(5) < birthDate.slice(5) ? 1 : 0);
}
export function daysBetween(a: string, b: string) { return (Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000; }
