import { eachDayOfInterval, formatISO9075, isAfter, isBefore, max, min, set } from 'date-fns';
import { DateCell, DateRange, DateRangeMap } from '../types/interfaces';

export const getDatesInRange = (
  month: DateCell[],
  range: DateRange,
  isPreview = false,
): DateRangeMap => {
  if (!range.start || !range.end || !month.length) {
    return {};
  }

  const r = {
    start: set(range.start, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }),
    end: set(range.end, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }),
  };

  const cellStartDate = month[0].date;
  const cellEndDate = month[month.length - 1].date;

  // return an empty object if the range is outside of the current month
  if (isBefore(r.end, cellStartDate) || isAfter(r.start, cellEndDate)) {
    return {};
  }

  // we change the range so that we create a map only for the visible dates.
  // increases performance a lot for long ranges.
  if (cellStartDate && isBefore(range.start, cellStartDate) && isAfter(range.end, cellStartDate)) {
    r.start = cellStartDate;
  }

  if (cellEndDate && isAfter(range.end, cellEndDate) && isBefore(range.start, cellEndDate)) {
    r.end = cellEndDate;
  }

  const dates = eachDayOfInterval(r);
  // could potentially use a js Map here, but not sure if that would make a difference performance wise. TODO: benchmark
  const dateMap: DateRangeMap = {};

  for (const date of dates) {
    const dateKey = formatISO9075(date, { representation: 'date' });

    dateMap[dateKey] = {
      position: 'center',
      preview: isPreview,
    };
  }

  // get the start and end dates of the range and set the position accordingly
  const minDate = min(dates);
  const maxDate = max(dates);
  const minDateKey = formatISO9075(minDate, { representation: 'date' });
  const maxDateKey = formatISO9075(maxDate, { representation: 'date' });
  dateMap[minDateKey].position = 'start';
  dateMap[maxDateKey].position = 'end';

  if (isAfter(minDate, r.start)) {
    dateMap[minDateKey].position = 'center';
  }

  if (isBefore(maxDate, r.end)) {
    dateMap[maxDateKey].position = 'center';
  }

  // if the dates are the same it means only 1 date is selected
  if (minDateKey === maxDateKey) {
    dateMap[minDateKey].position = 'solo';
  }

  return dateMap;
};
