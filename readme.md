# React Simple Date Range

A fast, modern and highly customizable Date range picker for React. Integrates seamlessly React Hook form and can be styled using your favourite css framework like tailwindcss.

```jsx
import { useState } from 'react';
import { DateRangePicker, DateRange } from 'react-simple-date-range';

const RangeExample = () => {
  const [range, setRange] = useState({
    start: null,
    end: null,
  } as DateRange);

  return (
    <DateRangePicker
      range={range}
      onRangeChange={(range) => setRange(() => range)}
    ></DateRangePicker>
  );
};

export default RangeExample;

```

## Features

- Effortless form integration
- Customizable cells
- Full control over disabled dates, with custom options
- Written in Typescript

## Documentation

The documentation is currently being worked on, if you have any issues please visit the [issues](https://www.github.com/) section on github.

## Contributing

Feel free to submit a PR on [Github](https://www.github.com/)