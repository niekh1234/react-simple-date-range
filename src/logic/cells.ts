import { addDays, formatISO9075, getDay, getDaysInMonth, subDays } from 'date-fns';
import { eachDayOfInterval } from 'date-fns/fp';
import { DateCell } from '../types/interfaces';
import { generateDisabledMap } from './disabled';

// returns a date object for every date in the current month + padding to fill in the entire grid.
export const getDateCells = (
  month: number,
  year: number,
  disabledDates?: DateCell[],
  disabledDays: number[] = [],
  minDate?: Date,
  maxDate?: Date,
): DateCell[] => {
  const daysInMonth = getDaysInMonth(new Date(year, month, 1));

  const days = eachDayOfInterval({
    start: new Date(year, month, 1),
    end: new Date(year, month, daysInMonth),
  });

  const disabledMap =
    disabledDates || disabledDays
      ? generateDisabledMap(month, year, disabledDates, disabledDays, minDate, maxDate)
      : {};

  const cells: DateCell[] = days.map((date: Date) => {
    let disabled = disabledMap[formatISO9075(date, { representation: 'date' })];

    if (!!disabled) {
      return {
        date,
        options: {
          disabled: true,
          ...disabled,
        },
      };
    }

    return { date, options: { disabled: false } };
  });

  const { paddingFront, paddingBack } = getPadding(days);

  return [...paddingFront, ...cells, ...paddingBack];
};

// adds "padding" to the current month, so that for example we show sun: 30, mon 1 as we always start on sunday but not all months do
const getPadding = (calendar: Date[]) => {
  const firstDay = calendar[0];
  // get a date object for the previous month
  const previousMonth = subDays(firstDay, 1);
  // obvious: get the number of days in the previous month
  const daysInPreviousMonth = getDaysInMonth(previousMonth);
  // get the index of the first weekday of our month (e.g. thu = 4)
  const startDayOfMonth = getDay(firstDay);

  // do some magic and add potential day objects for missing weekdays (e.g. if first day = 4 add last months' 0, 1, 2, 3);
  let paddingFront: DateCell[] = [];

  for (let day = daysInPreviousMonth - startDayOfMonth; day < daysInPreviousMonth; day++) {
    paddingFront.push({
      date: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), day + 1),
      options: { disabled: true },
    });
  }

  // now do the whole thing for the end of the month
  const lastDay = calendar[calendar.length - 1];
  const nextMonth = addDays(lastDay, 1);
  // we don't care about how many days there were in the previous month as it starts with 1 anyway
  const endDayOfMonth = getDay(lastDay);

  let paddingBack: DateCell[] = [];
  for (let day = 0; day < 6 - endDayOfMonth; day++) {
    paddingBack.push({
      date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day + 1),
      options: { disabled: true },
    });
  }

  return { paddingFront, paddingBack };
};
