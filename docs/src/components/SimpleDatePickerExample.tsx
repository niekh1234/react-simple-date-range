import React from 'react';
import { useState } from 'react';
import { DatePicker } from 'react-simple-date-range';

const MyDatePicker = () => {
  const [date, setDate] = useState(new Date());

  return (
    <DatePicker
      value={date}
      onChange={(newDate) => setDate(() => newDate)}
      cellHeight='40px'
    ></DatePicker>
  );
};

export default MyDatePicker;
