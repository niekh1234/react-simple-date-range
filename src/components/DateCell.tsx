import { isEqual, set } from 'date-fns';
import { classNames, getColors } from '../logic/utils';
import { DateCell } from '../types/interfaces';

interface DateCellRendererProps {
  cell: DateCell;
  date: Date;
  primaryColor: string;
  secondaryColor: string;
  cellHeight: string;
  customCell?: (cell: DateCell, active: Boolean) => JSX.Element;
}

const DateCellRenderer = ({
  cell,
  date,
  primaryColor,
  secondaryColor,
  customCell,
}: DateCellRendererProps) => {
  // checking if the current cell is active.
  const isHighlighted = isEqual(
    cell.date,
    set(date, { minutes: 0, hours: 0, seconds: 0, milliseconds: 0 }),
  );

  // when a custom cell is provided we return that element
  if (!!customCell) {
    return customCell(cell, isHighlighted);
  }

  const [textColor, backgroundColor] = getColors(
    primaryColor,
    secondaryColor,
    isHighlighted,
    false,
    false,
    cell.options?.disabled,
  );

  return (
    <div
      style={{ backgroundColor, color: textColor }}
      className={classNames(cell.options?.disabled && 'rsdr_disabled', 'rsdr_cell')}
    >
      {cell.date.getDate()}
    </div>
  );
};

export default DateCellRenderer;
