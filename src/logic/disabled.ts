import {
  addDays,
  isBefore,
  isAfter,
  differenceInCalendarDays,
  isWithinInterval,
  eachDayOfInterval,
  formatISO9075,
  setDay,
  add,
} from 'date-fns';
import { DateCell, DateRange } from '../types/interfaces';

// instead of having an array of dates we create an object with dates as keys for fast lookup
// so e.g. [Date, Date] -> {'02-10-2021': {...options}, '03-10-2021': {...options}}
export const generateDisabledMap = (
  month: number,
  year: number,
  disabledDates: DateCell[] = [],
  disabledDays: number[] = [],
  minDate?: Date,
  maxDate?: Date,
) => {
  // type is for an object with variable keys and which can contain an object with variable keys
  const disabledMap: { [key: string]: { [key: string]: any } } = {};

  const firstDayInMonth = new Date(year, month, 1);
  const lastDayInMonth = new Date(year, month + 1, 0);

  for (const day of disabledDates) {
    // we can ignore disabled days that are not in the current month, increases performance
    if (isBefore(day.date, firstDayInMonth) || isAfter(day.date, lastDayInMonth)) {
      continue;
    }

    const key = formatISO9075(day.date, { representation: 'date' });
    disabledMap[key] = day.options || {};
  }

  // add all specific weekdays
  for (const day of disabledDays) {
    let weekDay = setDay(firstDayInMonth, day);

    while (isBefore(weekDay, add(lastDayInMonth, { days: 1 }))) {
      disabledMap[formatISO9075(weekDay, { representation: 'date' })] = {};
      weekDay = addDays(weekDay, 7);
    }
  }

  // if a min or max date is provided we add those to the disabled map (if they are in the current month)
  if (minDate && isAfter(minDate, firstDayInMonth)) {
    for (const day of eachDayOfInterval({ start: firstDayInMonth, end: minDate })) {
      disabledMap[formatISO9075(day, { representation: 'date' })] = {};
    }
  }

  if (maxDate && isBefore(maxDate, lastDayInMonth)) {
    for (const day of eachDayOfInterval({ start: maxDate, end: lastDayInMonth })) {
      disabledMap[formatISO9075(day, { representation: 'date' })] = {};
    }
  }

  return disabledMap;
};

export const isRangeDisabled = (
  range: DateRange,
  disabledDates: DateCell[] = [],
  disabledDays: number[] = [],
  minDate?: Date,
  maxDate?: Date,
) => {
  if (!range.start || !range.end) {
    return false;
  }

  const r = {
    start: range.start,
    end: range.end,
  };

  if (disabledDates?.length > 0) {
    for (const disableDate of disabledDates) {
      if (isWithinInterval(disableDate.date, r)) {
        return true;
      }
    }
  }

  // in order to know if our range includes disabled weekdays we create an array of occupied weekdays (fast)
  // we do this by creating a loop from the start to the end of the range (or 7 days if there is more) and adding the weekdays to the array
  const occupiedWeekdayInRange: number[] = [];
  for (let i = 0; i < Math.min(differenceInCalendarDays(range.end, range.start) + 1, 7); i++) {
    occupiedWeekdayInRange.push(addDays(range.start, i).getDay());
  }

  // then we can check if in our array of unique weekdays there is some disabled day
  if (disabledDays.some((day) => occupiedWeekdayInRange.includes(day))) {
    return true;
  }

  // these shouldn't be selectable but in any case we need to make sure that a selected range is not out of bounds
  if (minDate && isBefore(range.start, minDate)) {
    return true;
  }

  if (maxDate && isAfter(range.end, maxDate)) {
    return true;
  }

  return false;
};
