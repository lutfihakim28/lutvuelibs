<script setup lang="ts">
  import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/vue/24/outline'
  import { computed, onMounted, ref, shallowRef, useTemplateRef } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { useSwipe } from '@vueuse/core'
  import { DateCell } from '@/models/DateCell';
  import { CalendarModeEnum } from '@/enums/CalendarModeEnum';

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

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const displayMonth = shallowRef<Dayjs>(dayjs());
  const datesRef = useTemplateRef('datesEl');
  const calendarMode = ref<CalendarModeEnum>(CalendarModeEnum.Date);

  const currentDays = computed<DateCell[]>(() => {
    const startOfMonth = displayMonth.value.startOf('month');
    const endOfMonth = displayMonth.value.endOf('month');

    const startDayOfWeek: number = startOfMonth.day();
    const endDayOfWeek: number = 7 - endOfMonth.day();

    const startDate = startOfMonth.subtract(startDayOfWeek, 'days');
    const endDate = endOfMonth.add(endDayOfWeek, 'days');

    return Array.from(
      { length: endDate.diff(startDate, 'day') },
      (_, index) => new DateCell(startDate.add(index, 'days'), displayMonth.value, modelValue.value)
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
    calendarMode.value = mode;
  }
</script>

<template>
  <section class="flex items-center">
    <button class="hover:bg-primary-200/20 p-2" @click="prevMonth">
      <ChevronLeftIcon class="size-6" />
    </button>
    <section v-if="calendarMode === CalendarModeEnum.Date" class="flex-1 flex items-center">
      <button class="py-2 flex-1 font-semibold hover:bg-primary-200/20"
        @click="() => changeMode(CalendarModeEnum.Month)">{{ displayMonth.format('MMMM') }}</button>
      <button class="py-2 flex-1 font-semibold hover:bg-primary-200/20"
        @click="() => changeMode(CalendarModeEnum.Year)">{{ displayMonth.format('YYYY') }}</button>
    </section>
    <section v-else class="flex-1 flex justify-center py-2 font-semibold">
      <span>{{ calendarMode === CalendarModeEnum.Month ? displayMonth.format('MMMM') : displayMonth.format('YYYY')
      }}</span>
    </section>
    <button class="hover:bg-primary-200/20 p-2" @click="nextMonth">
      <ChevronRightIcon class="size-6" />
    </button>
  </section>
  <section v-if="calendarMode === CalendarModeEnum.Date">
    <section class="grid grid-cols-7">
      <section v-for="(day, index) in daysInWeek" :key="index" class="text-center px-2 py-1">
        {{ day }}
      </section>
    </section>
    <section ref="datesEl" class="grid grid-cols-7">
      <button v-for="(cell, index) in currentDays" :key="index"
        :class="['text-center px-2 py-1 border', cell.isToday ? 'border-accent-600' : 'border-transparent', cell.isInMonth ? 'text-typograph-200' : 'text-typograph-500', cell.isSelected ? 'bg-accent-600' : 'hover:bg-accent-500/30 bg-transparent']"
        @click="() => selectDate(cell.date)" :disabled="cell.isSelected">
        {{ cell.date.format('D') }}
      </button>
    </section>
  </section>
  <section v-if="calendarMode === CalendarModeEnum.Month">
    <section class="grid grid-cols-4">
      <button v-for="month in months" :key="month" class="py-2 flex justify-center">
        {{ month }}
      </button>
    </section>
    <section>
      <button class="py-2 flex justify-center w-full hover:bg-primary-200/20"
        @click="() => changeMode(CalendarModeEnum.Date)">
        <CalendarIcon class="size-6" />
      </button>
    </section>
    <!-- <section class="grid grid-cols-7">
      <section v-for="(day, index) in daysInWeek" :key="index" class="text-center px-2 py-1">
        {{ day }}
      </section>
    </section>
    <section ref="datesEl" class="grid grid-cols-7">
      <button v-for="(cell, index) in currentDays" :key="index"
        :class="['text-center px-2 py-1 border', cell.isToday ? 'border-accent-600' : 'border-transparent', cell.isInMonth ? 'text-typograph-200' : 'text-typograph-500', cell.isSelected ? 'bg-accent-600' : 'hover:bg-accent-500/30 bg-transparent']"
        @click="() => selectDate(cell.date)" :disabled="cell.isSelected">
        {{ cell.date.format('D') }}
      </button>
    </section> -->
  </section>
  <section v-if="calendarMode === CalendarModeEnum.Year">
    <section>
      <button class="py-2 flex justify-center w-full hover:bg-primary-200/20"
        @click="() => changeMode(CalendarModeEnum.Date)">
        <CalendarIcon class="size-6" />
      </button>
    </section>
  </section>
  <section></section>
</template>