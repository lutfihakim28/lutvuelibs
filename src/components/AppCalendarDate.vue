<script setup lang="ts">
  import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/vue/24/outline'
  import { computed, onMounted, ref, shallowRef, useTemplateRef } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { useSwipe } from '@vueuse/core'
  import { DateCell } from '@/models/DateCell';
  import { CalendarModeEnum } from '@/enums/CalendarModeEnum';

  const { } = defineProps<{
    currentMonthDates: DateCell[],

  }>()
  const modelValue = defineModel<Dayjs>()

  const daysInWeek = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];

  const displayMonth = shallowRef<Dayjs>(dayjs());
  const datesRef = useTemplateRef('datesEl');

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
    datesRef.value?.addEventListener('wheel', (event) => {
      if (event.deltaY > 0) {
        prevMonth()
      }
      if (event.deltaY < 0) {
        nextMonth()
      }
    })
  })

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
    modelValue.value = date;
    if (!date.isSame(displayMonth.value, 'month')) {
      displayMonth.value = date;
    }
  }

  function changeMode(mode: CalendarModeEnum) {
    // calendarMode.value = mode;
  }
</script>

<template>
  <section class="flex items-center">
    <button class="hover:bg-primary-200/20 p-2" @click="prevMonth">
      <ChevronLeftIcon class="size-6" />
    </button>
    <section class="flex-1 flex items-center">
      <button class="py-2 flex-1 font-semibold hover:bg-primary-200/20"
        @click="() => changeMode(CalendarModeEnum.Month)">{{ displayMonth.format('MMMM') }}</button>
      <button class="py-2 flex-1 font-semibold hover:bg-primary-200/20"
        @click="() => changeMode(CalendarModeEnum.Year)">{{ displayMonth.format('YYYY') }}</button>
    </section>
    <button class="hover:bg-primary-200/20 p-2" @click="nextMonth">
      <ChevronRightIcon class="size-6" />
    </button>
  </section>
  <section>
    <section class="grid grid-cols-7">
      <section v-for="(day, index) in daysInWeek" :key="index" class="text-center px-2 py-1">
        {{ day }}
      </section>
    </section>
    <section ref="datesEl" class="grid grid-cols-7">
      <button v-for="(cell, index) in currentMonthDates" :key="index"
        :class="['text-center px-2 py-1 border', cell.isToday ? 'border-accent-600' : 'border-transparent', cell.isInMonth ? 'text-typograph-200' : 'text-typograph-500', cell.isSelected ? 'bg-accent-600' : 'hover:bg-accent-500/30 bg-transparent']"
        @click="() => selectDate(cell.date)" :disabled="cell.isSelected">
        {{ cell.date.format('D') }}
      </button>
    </section>
  </section>
  <section></section>
</template>