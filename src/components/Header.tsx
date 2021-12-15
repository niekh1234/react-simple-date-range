import { isAfter, isBefore } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { getBlackOrWhite, getMonthNames, getYears } from '../logic/utils';

interface RSDRHeaderProps {
  onSetMonth: (month: number) => void;
  onSetYear: (year: number) => void;
  primaryColor: string;
  secondaryColor: string;
  month: number;
  year: number;
  locale: string;
  minDate?: Date;
  maxDate?: Date;
}

const RSDRHeader = ({
  onSetMonth,
  onSetYear,
  primaryColor,
  secondaryColor,
  month,
  year,
  locale,
  minDate,
  maxDate,
}: RSDRHeaderProps) => {
  const months = useMemo(() => getMonthNames(locale), []);
  const years = useMemo(() => getYears(minDate, maxDate), []);

  const disablePreviousMonth = minDate && isBefore(new Date(year, month, 0), minDate);
  const disableNextMonth = maxDate && isAfter(new Date(year, month + 1, 0), maxDate);

  useEffect(() => {
    if (minDate && isAfter(minDate, new Date(year, month))) {
      onSetMonth(minDate.getMonth());
      onSetYear(minDate.getFullYear());
    }

    if (maxDate && isBefore(maxDate, new Date(year, month + 1))) {
      onSetMonth(maxDate.getMonth());
      onSetYear(maxDate.getFullYear());
    }
  }, [minDate, maxDate, month, year, onSetMonth, onSetYear]);

  const setPreviousMonth = () => {
    if (month === 0) {
      onSetMonth(11);
      onSetYear(year - 1);
    } else {
      onSetMonth(month - 1);
    }
  };

  const setNextMonth = () => {
    if (month === 11) {
      onSetMonth(0);
      onSetYear(year + 1);
    } else {
      onSetMonth(month + 1);
    }
  };

  return (
    <div className='rsdr_header' style={{ backgroundColor: primaryColor }}>
      <button
        onClick={() => setPreviousMonth()}
        className='rsdr_month-arrow'
        style={{
          backgroundColor: secondaryColor,
          color: getBlackOrWhite(secondaryColor),
          opacity: disablePreviousMonth ? 0.4 : 1,
          cursor: disablePreviousMonth ? 'not-allowed' : 'pointer',
        }}
        aria-label='Navigate to previous month'
        disabled={disablePreviousMonth}
        aria-disabled={disablePreviousMonth}
      >
        <svg
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M15 19l-7-7 7-7'
          ></path>
        </svg>
      </button>

      <div className='rsdr_selector'>
        <select value={month} onChange={(e) => onSetMonth(parseInt(e.target.value))}>
          {months.map((m, index) => (
            <option key={m} value={index}>
              {m}
            </option>
          ))}
        </select>
        <select value={year} onChange={(e) => onSetYear(parseInt(e.target.value))}>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setNextMonth()}
        className='rsdr_month-arrow'
        style={{
          backgroundColor: secondaryColor,
          color: getBlackOrWhite(secondaryColor),
          opacity: disableNextMonth ? 0.4 : 1,
          cursor: disableNextMonth ? 'not-allowed' : 'pointer',
        }}
        aria-label='Navigate to next month'
        disabled={disableNextMonth}
        aria-disabled={disableNextMonth}
      >
        <svg
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 5l7 7-7 7'
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default RSDRHeader;
