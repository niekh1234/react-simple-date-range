export interface DateCell {
  date: Date;
  options?: {
    disabled?: boolean;
    [key: string]: any;
  };
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
  options?: {
    [key: string]: any;
  };
}

export interface DateRangeMap {
  [key: string]: {
    position: string;
    preview: boolean;
  };
}
