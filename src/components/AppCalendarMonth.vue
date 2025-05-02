<script setup lang="ts">
import { CalendarModeEnum } from '@/enums/CalendarModeEnum';
import { MonthCell } from '@/models/MonthCell';
import { CalendarIcon } from '@heroicons/vue/24/outline';
import { useSwipe } from '@vueuse/core';
import type { Dayjs } from 'dayjs';
import { computed, onMounted, onUnmounted, shallowRef, useTemplateRef } from 'vue';
import AppCalendarLayout from './AppCalendarLayout.vue';
import dayjs from 'dayjs';

  const displayMonth = defineModel<Dayjs>('display-month', { required: true })
  const mode = defineModel<CalendarModeEnum>('mode', { required: true })

  const _displayMonth = shallowRef<Dayjs>(dayjs());
  const monthsRef = useTemplateRef('monthsEl');

  const currentYearMonths = computed<MonthCell[]>(() => {
    const startMonth = _displayMonth.value.startOf('year');

    return Array.from(
      { length: 12 },
      (_, index) => new MonthCell(startMonth.add(index, 'months'))
    );
  })

  useSwipe(monthsRef, {
    onSwipeEnd(_, direction) {
      if (direction === 'right') {
        prevYear();
        return;
      }
      nextYear();
    }
  });

  onMounted(() => {
    _displayMonth.value = displayMonth.value;
    monthsRef.value?.addEventListener('wheel', onWheel)
  })

  function onWheel(event: WheelEvent) {
    if (event.deltaY > 0) {
      nextYear()
    }
    if (event.deltaY < 0) {
      prevYear()
    }
  } 

  function nextYear(): void {
    changeDisplayYear(offsetYear(1));
  }

  function prevYear(): void {
    changeDisplayYear(offsetYear(-1));
  }

  function offsetYear(offset: number): Dayjs {
    return _displayMonth.value.add(offset, 'year');
  }

  function changeDisplayYear(target: Dayjs): void {
    if (isBeforeEpoch(target)) return;
    _displayMonth.value = target;
  }

  function isBeforeEpoch(target: Dayjs) {
    return target.isBefore(dayjs('1970-01-01'), 'year');
  }

  function changeMode(_mode: CalendarModeEnum) {
    mode.value = _mode;
  }

  function selectMonth(month: Dayjs) {
    displayMonth.value = month;
    changeMode(CalendarModeEnum.Date);
  }

  onUnmounted(() => {
    monthsRef.value?.removeEventListener('wheel', onWheel)
  })
</script>

<template>
  <AppCalendarLayout
    @prev="prevYear"
    @next="nextYear"
  >
    <template #header>
      <button
        class="py-2 flex-1 font-semibold hover:bg-primary-200/20"
        @click="() => changeMode(CalendarModeEnum.Year)"
      >
        {{ _displayMonth?.format('YYYY') }}
      </button>
    </template>

    <section
      ref="monthsEl"
      class="grid grid-cols-3"
    >
      <button
        v-for="(cell, index) in currentYearMonths"
        :key="index"
        :class="['text-center px-2 h-12 py-1 border text-typograph-200 hover:bg-accent-500/30', cell.isThisMonth ? 'border-accent-600' : 'border-transparent']"
        @click="() => selectMonth(cell.date)"
      >
        {{ cell.date.format('MMM') }}
      </button>
    </section>

    <template #footer>
      <button
        class="w-full flex justify-center hover:bg-primary-200/20 py-2"
        @click="() => changeMode(CalendarModeEnum.Date)"
      >
        <CalendarIcon class="size-6" />
      </button>
    </template>
  </AppCalendarLayout>
</template>