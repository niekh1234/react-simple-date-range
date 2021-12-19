import React from 'react';
import { useState } from 'react';
import { DateRangePicker, DateRange } from 'react-simple-date-range';

const DarkModeExample = () => {
  const [range, setRange] = useState({
    start: null,
    end: null,
  } as DateRange);

  return (
    <DateRangePicker
      value={range}
      onChange={(newRange) => setRange(() => newRange)}
      dark
      primaryColor='#1f2937'
      secondaryColor='#374151'
      cellHeight='40px'
    ></DateRangePicker>
  );
};

export default DarkModeExample;
