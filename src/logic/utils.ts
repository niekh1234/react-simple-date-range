export const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};

// returns "mon, tue, wed.. etc" for the calendar headers in specified locale
export const getDayInitials = (locale: string = 'default') => {
  // in 1905 january 1st was on a sunday and we want the dates in that order...
  let days = [];
  for (let i = 0; i < 7; i++) {
    days.push(new Date(1905, 0, i + 1).toLocaleString(locale, { weekday: 'short' }));
  }

  return days;
};

// returns full month names for entire year in specified locale
export const getMonthNames = (locale: string = 'default') => {
  let months = [];
  for (let i = 0; i < 12; i++) {
    months.push(new Date(1900, i, 1).toLocaleString(locale, { month: 'long' }));
  }

  return months;
};

// returns years from 1900-now for the select
export const getYears = (minDate?: Date, maxDate?: Date) => {
  const minYear = minDate ? minDate.getFullYear() : 1900;
  const maxYear = maxDate ? maxDate.getFullYear() : new Date().getFullYear() + 20;

  let years = [];
  for (let i = maxYear; i >= minYear; i--) {
    years.push(i);
  }

  return years;
};

export const getBorderRadius = (position: string) => {
  switch (position) {
    case 'start':
      return '8px 0px 0px 8px';
    case 'end':
      return '0px 8px 8px 0px';
    case 'center':
      return '0px';
    default:
      return '8px';
  }
};

export const getBackgroundColor = (
  primaryColor: string,
  isHighlighted: Boolean,
  isPreview: Boolean,
  isDisabled?: Boolean,
) => {
  if (isPreview) {
    return '#eeeeee';
  } else if (isHighlighted && !isDisabled) {
    return primaryColor;
  }
  return '#ffffff';
};

export const getColors = (
  primaryColor: string,
  isHighlighted: Boolean,
  isPreview: Boolean,
  isDisabled?: Boolean,
) => {
  const backgroundColor = getBackgroundColor(primaryColor, isHighlighted, isPreview, isDisabled);

  if (isDisabled) {
    return ['#cccccc', backgroundColor];
  } else if (isHighlighted && backgroundColor) {
    const textColor = getBlackOrWhite(backgroundColor);
    return [textColor, backgroundColor];
  }

  return ['#000000', backgroundColor];
};

// checks a hex value and returns either black or white depending on how dark the color is
export const getBlackOrWhite = (color: string) => {
  if (color.length !== 7) {
    return '#000000';
  }

  return parseInt(color.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff';
};
