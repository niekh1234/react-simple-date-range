import React from 'react';
import { useState } from 'react';
import { DateRangePicker, DateRange } from 'react-simple-date-range';

const DisabledDatesSimpleExample = () => {
  const [range, setRange] = useState({ start: null, end: null } as DateRange);

  return (
    <DateRangePicker
      value={range}
      onChange={(newRange) => setRange(() => newRange)}
      cellHeight='40px'
      disabledDays={[0, 6]}
    ></DateRangePicker>
  );
};

export default DisabledDatesSimpleExample;
