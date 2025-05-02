import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export class YearCell {
  constructor(
    public date: Dayjs,
  ) { };

  public get isThisYear() {
    return this.date.isSame(dayjs(), 'year')
  }
}