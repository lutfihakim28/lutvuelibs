<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { useSwipe } from '@vueuse/core'
  import { DateCell } from '@/models/DateCell';
  import { CalendarModeEnum } from '@/enums/CalendarModeEnum';
  import AppCalendarLayout from './AppCalendarLayout.vue';

  const displayMonth = defineModel<Dayjs>('display-month', { required: true })
  const selectedDate = defineModel<Dayjs>('selected-date')
  const mode = defineModel<CalendarModeEnum>('mode', { required: true });

  const daysInWeek = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];

  const highlightedDate = ref<Dayjs>();
  const latestHighlightedDate = ref<Dayjs>();
  const datesRef = useTemplateRef('datesEl');

  const currentMonthDates = computed<DateCell[]>(() => {
    const startOfMonth = displayMonth.value.startOf('month');
    const endOfMonth = displayMonth.value.endOf('month');

    const startDayOfWeek: number = startOfMonth.day();
    const endDayOfWeek: number = 7 - endOfMonth.day();

    const startDate = startOfMonth.subtract(startDayOfWeek, 'days');
    const endDate = endOfMonth.add(endDayOfWeek, 'days');

    return Array.from(
      { length: endDate.diff(startDate, 'day') },
      (_, index) => new DateCell(startDate.add(index, 'days'), displayMonth.value, selectedDate.value, highlightedDate.value)
    );
  })

  useSwipe(datesRef, {
    onSwipeEnd(_, direction) {
      if (direction === 'right') {
        prevMonth();
        return;
      }
      nextMonth();
    }
  });

  onMounted(() => {
    datesRef.value?.addEventListener('wheel', onWheel)
    document.addEventListener('keydown', moveHighlight)
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('keypress', onEnter)
  })

  function onWheel(event: WheelEvent) {
    if (event.deltaY > 0) {
      nextMonth()
    }
    if (event.deltaY < 0) {
      prevMonth()
    }
  } 

  function nextMonth(): void {
    changeDisplayMonth(offSetMonth(1));
  }

  function prevMonth(): void {
    changeDisplayMonth(offSetMonth(-1));
  }

  function changeDisplayMonth(target: Dayjs): void {
    displayMonth.value = target;
  }

  function offSetMonth(offset: number): Dayjs {
    return displayMonth.value.add(offset, 'month');
  }

  function selectDate(date: Dayjs): void {
    selectedDate.value = date;
    if (!date.isSame(displayMonth.value, 'month')) {
      displayMonth.value = date;
    }
  }

  function changeMode(_mode: CalendarModeEnum) {
    mode.value = _mode;
  }

  function moveHighlight(event: KeyboardEvent) {
    if (!highlightedDate.value) {
      highlightedDate.value = latestHighlightedDate.value || selectedDate.value || dayjs();
      return
    }
    const key = event.code;
    switch (key) {
      case 'ArrowRight':
        highlightedDate.value = highlightedDate.value.add(1, 'day')
        break;
      case 'ArrowLeft':
        highlightedDate.value = highlightedDate.value.subtract(1, 'day')
        break;
      case 'ArrowDown':
        highlightedDate.value = highlightedDate.value.add(1, 'week')
        break;
      case 'ArrowUp':
        highlightedDate.value = highlightedDate.value.subtract(1, 'week')
        break;
      default:
        break;
    }
  }

  function onEnter(event: KeyboardEvent) {
    if (event.code === 'Enter' && highlightedDate.value && !highlightedDate.value.isSame(selectedDate.value)) {
      selectDate(highlightedDate.value)
    }
  }

  function mouseMove() {
    if (highlightedDate.value) {
      latestHighlightedDate.value = highlightedDate.value;
      highlightedDate.value = undefined;
    }
  }

  watch(highlightedDate, (date) => {
    if (date && !date.isSame(displayMonth.value, 'month')) {
      displayMonth.value = date;
    }
  })

  onUnmounted(() => {
    datesRef.value?.removeEventListener('wheel', onWheel)
    document.removeEventListener('keydown', moveHighlight)
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('keypress', onEnter)
  })
</script>

<template>
  <AppCalendarLayout
    @prev="prevMonth"
    @next="nextMonth"
  >
    <template #header>
      <button
        class="py-2 flex-1 font-semibold hover:bg-primary-200/20"
        @click="() => changeMode(CalendarModeEnum.Month)"
      >
        {{ displayMonth.format('MMMM') }}
      </button>
      <button
        class="py-2 flex-1 font-semibold hover:bg-primary-200/20"
        @click="() => changeMode(CalendarModeEnum.Year)"
      >
        {{ displayMonth.format('YYYY') }}
      </button>
    </template>

    <section>
      <section class="grid grid-cols-7">
        <section
          v-for="(day, index) in daysInWeek"
          :key="index"
          class="text-center px-2 py-1"
        >
          {{ day }}
        </section>
      </section>
      <section
        ref="datesEl"
        class="grid grid-cols-7"
      >
        <button
          v-for="(cell, index) in currentMonthDates"
          :key="index"
          :class="[
            'text-center px-2 py-1 border w-12 h-12',
            {
              'border-transparent': !cell.isToday,
              'border-accent-600': cell.isToday,
              'text-typograph-200': cell.isInMonth,
              'text-typograph-500': !cell.isInMonth,
              'bg-accent-600': cell.isSelected,
              'bg-accent-500/30': cell.isHighlighted && !cell.isSelected,
              'bg-transparent': !cell.isHighlighted && !cell.isSelected,
              'hover:bg-accent-500/30': !highlightedDate,
            },
          ]"
          @click="() => selectDate(cell.date)"
          :disabled="cell.isSelected"
        >
          {{ cell.date.format('D') }}
        </button>
      </section>
    </section>

    <template #footer>
      <span />
    </template>
  </AppCalendarLayout>
</template>