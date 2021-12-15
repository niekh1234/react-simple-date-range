import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { DateCell } from '../types/interfaces';
import { formatISO9075 } from 'date-fns';
import RSDRHeader from './Header';
import { getDayInitials } from '../logic/utils';
import { getDateCells } from '../logic/cells';
import DateInput from './Input';
import DateCellRenderer from './DateCell';
import '../css/rsdr.css';

export interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  primaryColor?: string;
  secondaryColor?: string;
  disabledDates?: DateCell[];
  disabledDays?: number[];
  style?: CSSProperties;
  customCell?: (cell: DateCell, active: Boolean) => JSX.Element;
  locale?: string;
  collapsable?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export const DatePicker = ({
  date,
  onDateChange,
  primaryColor = '#18b8b0',
  secondaryColor = '#d1fffd',
  disabledDates,
  disabledDays,
  style = { width: '20rem' },
  customCell,
  locale = 'default',
  collapsable = false,
  minDate,
  maxDate,
}: DatePickerProps) => {
  const [collapse, setCollapse] = useState(!collapsable);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [visibleDays, setVisibleDays] = useState<DateCell[]>();

  const dayInitials = useMemo(() => getDayInitials(locale), []);

  useEffect(() => {
    const cells = getDateCells(month, year, disabledDates, disabledDays, minDate, maxDate);

    setVisibleDays(() => cells);
  }, [month, year, disabledDates]);

  const inputValue = formatISO9075(date, { representation: 'date' });

  const handleClickOutside = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    if (!e.currentTarget.contains(e.relatedTarget) && collapsable) {
      setCollapse(() => false);
    }
  };

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
                  onClick={() => onDateChange(cell.date)}
                  key={cell.date.getTime()}
                  disabled={cell.options?.disabled}
                  style={{ padding: '0.1rem 0rem' }}
                  aria-label={`Select date ${cell.date.toLocaleDateString(locale)}`}
                >
                  <DateCellRenderer
                    cell={cell}
                    date={date}
                    customCell={customCell}
                    primaryColor={primaryColor}
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
