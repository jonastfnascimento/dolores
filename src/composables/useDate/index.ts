export function useDate(dateTime: string) {
  if (dateTime === '-') {
    return dateTime;
  }

  const [date] = dateTime.split(' ');
  const [year, month, day] = date.split('-');

  return `${day}/${month}/${year}`;
}
