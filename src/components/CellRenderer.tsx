import { formatISO9075, isEqual, set } from 'date-fns';
import { getBorderRadius, getColors } from '../logic/utils';
import { DateCell, DateRangeMap } from '../types/interfaces';

interface CellRendererProps {
  cell: DateCell;
  range?: DateRangeMap;
  date?: Date;
  primaryColor: string;
  secondaryColor: string;
  cellHeight: string;
  dark?: Boolean;
  customCell?: (cell: DateCell, isHighlighted: Boolean, showPreview: Boolean) => JSX.Element;
}

const CellRenderer = ({
  cell,
  range,
  date,
  primaryColor,
  secondaryColor,
  cellHeight,
  dark,
  customCell,
}: CellRendererProps) => {
  // checking if the current cell is isHighlighted in the hashmap
  let currentRangeCellData = range && range[formatISO9075(cell.date, { representation: 'date' })];
  let isHighlighted = !!currentRangeCellData && !currentRangeCellData?.preview;
  let showPreview = (currentRangeCellData?.preview && !cell.options?.disabled) || false;

  if (date) {
    isHighlighted = isEqual(
      cell.date,
      set(date, { minutes: 0, hours: 0, seconds: 0, milliseconds: 0 }),
    );
  }

  // when a custom cell is provided we return that element
  if (!!customCell) {
    return customCell(cell, isHighlighted, showPreview);
  }

  const borderRadius = getBorderRadius(currentRangeCellData?.position);
  const [textColor, backgroundColor] = getColors(
    primaryColor,
    secondaryColor,
    isHighlighted,
    showPreview,
    currentRangeCellData?.position !== undefined && currentRangeCellData?.position === 'center',
    cell.options?.disabled,
    dark,
  );

  return (
    <div
      style={{
        borderRadius,
        backgroundColor,
        color: textColor,
        height: cellHeight,
      }}
      className={`rsdr_cell ${cell.options?.disabled ? 'rsdr_disabled' : ''}  ${
        dark ? 'rsdr_dark' : ''
      }`}
    >
      {cell.date.getDate()}
    </div>
  );
};

export default CellRenderer;
