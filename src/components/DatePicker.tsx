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
  value: Date;
  onChange: (date: Date) => void;
  primaryColor?: string;
  secondaryColor?: string;
  disabledDates?: DateCell[];
  disabledDays?: number[];
  style?: CSSProperties;
  cellHeight?: string;
  customCell?: (cell: DateCell, active: Boolean) => JSX.Element;
  locale?: string;
  collapsable?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export const DatePicker = ({
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

  const inputValue = formatISO9075(value, { representation: 'date' });

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
                  onClick={() => onChange(cell.date)}
                  key={cell.date.getTime()}
                  disabled={cell.options?.disabled}
                  style={{ padding: '1px 0px' }}
                  aria-label={`Select date ${cell.date.toLocaleDateString(locale)}`}
                >
                  <DateCellRenderer
                    cell={cell}
                    date={value}
                    cellHeight={cellHeight}
                    customCell={customCell}
                    secondaryColor={secondaryColor}
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
