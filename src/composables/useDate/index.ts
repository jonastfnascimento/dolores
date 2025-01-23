export function useDate(dateTime: string) {
  const [date] = dateTime.split(' ');
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}
