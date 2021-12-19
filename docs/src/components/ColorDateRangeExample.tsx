import { add, set } from 'date-fns';
import React from 'react';
import { useState } from 'react';
import { DateRange, DateRangePicker } from 'react-simple-date-range';

const ColorDateRangeExample = ({
  primaryColor = '#84cc16',
  secondaryColor = '#d9f99d',
}: {
  primaryColor: string;
  secondaryColor: string;
}) => {
  const [range, setRange] = useState({
    start: set(new Date(), { date: 8 }),
    end: set(new Date(), { date: 18 }),
  } as DateRange);

  return (
    <DateRangePicker
      value={range}
      onChange={(newDate) => setRange(() => newDate)}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      cellHeight='40px'
    ></DateRangePicker>
  );
};

export default ColorDateRangeExample;
