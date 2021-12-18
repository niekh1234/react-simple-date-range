import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { getDateCells } from '../logic/cells';
import { DateCell, DateRange, DateRangeMap } from '../types/interfaces';
import { formatISO9075, isBefore } from 'date-fns';
import { getDayInitials } from '../logic/utils';
import { getDatesInRange } from '../logic/range';
import { isRangeDisabled } from '../logic/disabled';
import RangeCellRenderer from './RangeCell';
import RSDRHeader from './Header';
import DateInput from './Input';
import '../css/rsdr.css';

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  primaryColor?: string;
  secondaryColor?: string;
  disabledDates?: DateCell[];
  disabledDays?: number[];
  style?: CSSProperties;
  cellHeight?: string;
  customCell?: (cell: DateCell, active: Boolean, showPreview: Boolean) => JSX.Element;
  locale?: string;
  collapsable?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export const DateRangePicker = ({
  value,
  onChange,
  primaryColor = '#8b5cf6',
  secondaryColor = '#ede9fe',
  disabledDates,
  disabledDays,
  style = { width: '20rem' },
  customCell,
  cellHeight = '32px',
  locale = 'default',
  collapsable = false,
  minDate,
  maxDate,
}: DateRangePickerProps) => {
  const [collapse, setCollapse] = useState(!collapsable);
  const [previewRange, setPreviewRange] = useState({} as DateRangeMap);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [visibleDays, setVisibleDays] = useState<DateCell[]>([]);

  const dayInitials = useMemo(() => getDayInitials(locale), []);
  const datesInRange = getDatesInRange(visibleDays, value);

  useEffect(() => {
    const cells = getDateCells(month, year, disabledDates, disabledDays, minDate, maxDate);

    setVisibleDays(() => cells);
  }, [month, year, disabledDates]);

  // highlight selected date range
  const handleRangePreview = (cell: DateCell) => {
    if (cell.options?.disabled || !value.start || (value.start && value.end)) {
      setPreviewRange(() => ({}));
      return;
    }

    const newRange = {
      start: value.start,
      end: cell.date,
    };

    // make sure the interval is chronological, if not, swap the dates
    if (isBefore(newRange.end, newRange.start)) {
      const start = newRange.start;
      newRange.start = newRange.end;
      newRange.end = start;
    }

    // check if some date within the range is disabled
    if (isRangeDisabled(newRange, disabledDates, disabledDays, minDate, maxDate)) {
      return;
    }

    const dateRangeMap = getDatesInRange(visibleDays, newRange, true);

    setPreviewRange(() => dateRangeMap);
  };

  const handleRangeSelection = (date: Date) => {
    const newRange = {
      start: value.start,
      end: value.end,
      options: value.options,
    };

    // here we determine our next action depending on the current state of the range
    if (value.start && value.end) {
      newRange.start = date;
      newRange.end = null;
    } else if (value.start) {
      if (isBefore(date, value.start)) {
        newRange.start = date;
        newRange.end = value.start;
      } else {
        newRange.end = date;
      }
    } else {
      newRange.start = date;
    }

    // check if some date within the range is disabled
    if (isRangeDisabled(newRange, disabledDates, disabledDays, minDate, maxDate)) {
      return;
    }

    // if the range is good, clear the preview.
    setPreviewRange(() => ({}));
    // update the range
    onChange(newRange);
  };

  const handleClickOutside = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    if (!e.currentTarget.contains(e.relatedTarget) && collapsable) {
      setCollapse(() => false);
    }
  };

  // todo refactor, that looks like a mess
  const inputValue =
    value.start && value.end
      ? `${value.start ? formatISO9075(value.start, { representation: 'date' }) : '?'} → ${
          value.end ? formatISO9075(value.end, { representation: 'date' }) : '?'
        }`
      : 'Select dates';

  return (
    <div
      className='rsdr_parent-container'
      tabIndex={0}
      onFocus={() => setCollapse(true)}
      onBlur={(e) => handleClickOutside(e)}
      style={style}
    >
      {collapsable && <DateInput value={inputValue} primaryColor={primaryColor}></DateInput>}

      {collapse && (
        <div className='rsdr_container' style={style}>
          <RSDRHeader
            month={month}
            year={year}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            onSetMonth={(month) => setMonth(() => month)}
            onSetYear={(year) => setYear(() => year)}
            locale={locale}
            minDate={minDate}
            maxDate={maxDate}
          ></RSDRHeader>

          <div className='rsdr_calendar'>
            <div className='rsdr_calendar-header'>
              {dayInitials.map((day) => (
                <div key={day} className='rsdr_header-weekday'>
                  {day}
                </div>
              ))}
            </div>
            <div className='rsdr_daypicker'>
              {visibleDays?.map((cell) => (
                <button
                  onClick={() => handleRangeSelection(cell.date)}
                  onMouseEnter={() => handleRangePreview(cell)}
                  key={cell.date.getTime()}
                  disabled={cell.options?.disabled}
                  style={{ padding: '1px 0px' }}
                  aria-label={`Select date ${cell.date.toLocaleDateString(locale)}`}
                >
                  <RangeCellRenderer
                    cell={cell}
                    range={{ ...datesInRange, ...previewRange }}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    cellHeight={cellHeight}
                    customCell={customCell}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
