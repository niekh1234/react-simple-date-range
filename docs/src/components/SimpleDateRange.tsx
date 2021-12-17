import { useState } from 'react';
import { DateRangePicker, DateRange } from 'react-simple-date-range';

const MyRangePicker = () => {
  const [range, setRange] = useState({
    start: null,
    end: null,
  } as DateRange);

  return (
    <DateRangePicker
      value={range}
      onChange={(newRange) => setRange(() => newRange)}
    ></DateRangePicker>
  );
};

export default MyRangePicker;
