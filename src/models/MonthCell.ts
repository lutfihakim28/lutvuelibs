import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export class MonthCell {
  constructor(
    public date: Dayjs,
  ) { };

  public get isThisMonth() {
    return this.date.isSame(dayjs(), 'month')
  }
}