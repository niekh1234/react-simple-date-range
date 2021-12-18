import React from 'react';
import { useState } from 'react';
import { DateRangePicker, DateRange } from 'react-simple-date-range';

const SimpleDateRangeExample = () => {
  const [range, setRange] = useState({
    start: null,
    end: null,
  } as DateRange);

  return (
    <DateRangePicker
      value={range}
      onChange={(newRange) => setRange(() => newRange)}
      cellHeight='40px'
    ></DateRangePicker>
  );
};

export default SimpleDateRangeExample;
