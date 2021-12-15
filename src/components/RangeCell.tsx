import { formatISO9075 } from 'date-fns';
import { getBorderRadius, getColors } from '../logic/utils';
import { DateCell, DateRangeMap } from '../types/interfaces';

interface RangeCellRendererProps {
  cell: DateCell;
  range: DateRangeMap;
  primaryColor: string;
  customCell?: (cell: DateCell, isHighlighted: Boolean, showPreview: Boolean) => JSX.Element;
}

const RangeCellRenderer = ({ cell, range, primaryColor, customCell }: RangeCellRendererProps) => {
  // checking if the current cell is isHighlighted in the hashmap
  const currentRangeCellData = range[formatISO9075(cell.date, { representation: 'date' })];
  const isHighlighted = !!currentRangeCellData && !currentRangeCellData?.preview;
  const showPreview = currentRangeCellData?.preview && !cell.options?.disabled;

  // when a custom cell is provided we return that element
  if (!!customCell) {
    return customCell(cell, isHighlighted, showPreview);
  }

  const borderRadius = getBorderRadius(currentRangeCellData?.position);
  const [textColor, backgroundColor] = getColors(
    primaryColor,
    isHighlighted,
    showPreview,
    cell.options?.disabled,
  );

  return (
    <div
      style={{
        borderRadius,
        backgroundColor,
        color: textColor,
      }}
      className='rsdr_range-cell'
    >
      {cell.date.getDate()}
    </div>
  );
};

export default RangeCellRenderer;
