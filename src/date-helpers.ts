import {
  getDayOfYear,
  getMonth,
  getWeek,
  getYear,
  startOfToday,
  format,
  max,
  differenceInDays,
} from "date-fns";

export const formatShortDate = (date: string | Date) =>
  format(date, "iii do MMM");
export const formatDay = (date: string | Date) => format(date, "MMMM do");
export const formatWeekOfYear = (date: string | Date) =>
  `${getWeek(date)} of ${getYear(date)}`;
export const formatMonthOfYear = (date: string | Date) =>
  format(date, "MMMM yyyy");
export const formatYear = (date: string | Date) => getYear(date).toString();
export const countDaysToNow = (date: string | Date) =>
  differenceInDays(new Date(), date);

export const maxDate = (dates: (string | Date)[]): Date | null => max(dates);

export const today = startOfToday();
export const day = `day-${getDayOfYear(today)}-${getYear(today)}`;
export const week = `week-${getWeek(today)}-${getYear(today)}`;
export const month = `month-${getMonth(today)}-${getYear(today)}`;
export const year = `year-${getYear(today)}`;
