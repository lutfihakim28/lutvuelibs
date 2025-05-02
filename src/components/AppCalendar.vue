<script setup lang="ts">
  import { ref, shallowRef } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
import AppCalendarDate from './AppCalendarDate.vue';
import { CalendarModeEnum } from '@/enums/CalendarModeEnum';
import AppCalendarMonth from './AppCalendarMonth.vue';
import AppCalendarYear from './AppCalendarYear.vue';

  const modelValue = defineModel<Dayjs>()

  // const daysInWeek = [
  //   'Sun',
  //   'Mon',
  //   'Tue',
  //   'Wed',
  //   'Thu',
  //   'Fri',
  //   'Sat',
  // ];

  // const months = [
  //   'January',
  //   'February',
  //   'March',
  //   'April',
  //   'May',
  //   'June',
  //   'July',
  //   'August',
  //   'September',
  //   'October',
  //   'November',
  //   'December'
  // ];

  const displayMonth = shallowRef<Dayjs>(dayjs());
  // const datesRef = useTemplateRef('datesEl');
  const calendarMode = ref<CalendarModeEnum>(CalendarModeEnum.Date);

  // const currentDays = computed<DateCell[]>(() => {
  //   const startOfMonth = displayMonth.value.startOf('month');
  //   const endOfMonth = displayMonth.value.endOf('month');

  //   const startDayOfWeek: number = startOfMonth.day();
  //   const endDayOfWeek: number = 7 - endOfMonth.day();

  //   const startDate = startOfMonth.subtract(startDayOfWeek, 'days');
  //   const endDate = endOfMonth.add(endDayOfWeek, 'days');

  //   return Array.from(
  //     { length: endDate.diff(startDate, 'day') },
  //     (_, index) => new DateCell(startDate.add(index, 'days'), displayMonth.value, modelValue.value)
  //   );
  // })

  // useSwipe(datesRef, {
  //   onSwipeEnd(_, direction) {
  //     if (direction === 'right') {
  //       prevMonth();
  //       return;
  //     }
  //     nextMonth();
  //   }
  // });

  // onMounted(() => {
  //   datesRef.value?.addEventListener('wheel', (event) => {
  //     if (event.deltaY > 0) {
  //       prevMonth()
  //     }
  //     if (event.deltaY < 0) {
  //       nextMonth()
  //     }
  //   })
  // })

  // function nextMonth(): void {
  //   changeDisplayMonth(offSetMonth(1));
  // }

  // function prevMonth(): void {
  //   changeDisplayMonth(offSetMonth(-1));
  // }

  // function changeDisplayMonth(target: Dayjs): void {
  //   displayMonth.value = target;
  // }

  // function offSetMonth(offset: number): Dayjs {
  //   return displayMonth.value.add(offset, 'month');
  // }

  // function selectDate(date: Dayjs): void {
  //   modelValue.value = date;
  //   if (!date.isSame(displayMonth.value, 'month')) {
  //     displayMonth.value = date;
  //   }
  // }

  // function changeMode(mode: CalendarModeEnum) {
  //   calendarMode.value = mode;
  // }
</script>

<template>
  <AppCalendarDate
    v-if="calendarMode === CalendarModeEnum.Date"
    v-model:display-month="displayMonth"
    v-model:selected-date="modelValue"
    v-model:mode="calendarMode"
  />
  <AppCalendarMonth
    v-if="calendarMode === CalendarModeEnum.Month"
    v-model:display-month="displayMonth"
    v-model:mode="calendarMode"
  />
  <AppCalendarYear
    v-if="calendarMode === CalendarModeEnum.Year"
    v-model:display-month="displayMonth"
    v-model:mode="calendarMode"
  />
</template>