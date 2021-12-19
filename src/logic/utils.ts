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

export const getBorderRadius = (position?: string) => {
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
  secondaryColor: string,
  isHighlighted: Boolean,
  isEdge: Boolean,
  isPreview: Boolean,
  isDisabled?: Boolean,
) => {
  if (isEdge && (isHighlighted || isPreview)) {
    return primaryColor;
  } else if (isPreview) {
    return secondaryColor;
  } else if (isHighlighted && !isDisabled) {
    return secondaryColor;
  }
  return '';
};

export const getColors = (
  primaryColor: string,
  secondaryColor: string,
  isHighlighted: Boolean,
  isPreview: Boolean,
  isCenter: Boolean,
  isDisabled?: Boolean,
  dark?: Boolean,
) => {
  const backgroundColor = getBackgroundColor(
    primaryColor,
    secondaryColor,
    isHighlighted,
    !isCenter,
    isPreview,
    isDisabled,
  );

  if (isDisabled) {
    console.log('yep');
    if (dark) {
      return ['#374151', backgroundColor];
    }
    return ['#e5e7eb', backgroundColor];
  } else if ((isHighlighted || isPreview) && backgroundColor) {
    const textColor = getBlackOrWhite(backgroundColor);
    return [textColor, backgroundColor];
  }

  if (dark) {
    return ['#ffffff', backgroundColor];
  }

  return ['#000000', backgroundColor];
};

// checks a hex value and returns either black or white depending on how dark the color is
export const getBlackOrWhite = (color: string) => {
  if (color.length !== 7) {
    return '#000000';
  }

  return parseInt(color.replace('#', ''), 16) > 0xffffff / 2 ? '#000000' : '#ffffff';
};
