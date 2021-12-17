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
      style={{ width: '400px' }}
    ></DateRangePicker>
  );
};

export default SimpleDateRangeExample;
