import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export class DateCell {


  constructor(
    public date: Dayjs,
    public displayMonth: Dayjs,
    public selectedDate?: Dayjs,
    public highlightedDate?: Dayjs,
  ) { };

  public get isToday() {
    return this.date.isSame(dayjs(), 'day')
  }

  public get isInMonth() {
    return this.date.isSame(this.displayMonth, 'month')
  }

  public get isSelected() {
    if (!this.selectedDate) return false;
    return this.date.isSame(this.selectedDate, 'day')
  }

  public get isHighlighted() {
    if (!this.highlightedDate) return false;
    return this.date.isSame(this.highlightedDate, 'day')
  }
}