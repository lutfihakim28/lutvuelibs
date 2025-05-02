<script setup lang="ts">
import { CalendarModeEnum } from '@/enums/CalendarModeEnum';
import { CalendarIcon } from '@heroicons/vue/24/outline';
import { useSwipe } from '@vueuse/core';
import type { Dayjs } from 'dayjs';
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import AppCalendarLayout from './AppCalendarLayout.vue';
import { YearCell } from '@/models/YearCell';
import dayjs from 'dayjs';

  const displayMonth = defineModel<Dayjs>('display-month', { required: true })
  const mode = defineModel<CalendarModeEnum>('mode', { required: true });

  const page = ref<number>(1);
  const yearsRef = useTemplateRef('yearsEl');

  const currentYearRange = computed<YearCell[]>(() => {
    const startYear = dayjs('1970-01-01');

    return Array.from(
      { length: 12 },
      (_, index) => new YearCell(startYear.add((page.value - 1) * 12 + index, 'years'))
    );
  })

  useSwipe(yearsRef, {
    onSwipeEnd(_, direction) {
      if (direction === 'right') {
        prevRange();
        return;
      }
      nextRange();
    }
  });

  onMounted(() => {
    page.value = Math.floor((displayMonth.value.year() - 1970) / 12) + 1;
    yearsRef.value?.addEventListener('wheel', onWheel)
  })

  function onWheel(event: WheelEvent) {
    if (event.deltaY > 0) {
      nextRange()
    }
    if (event.deltaY < 0) {
      prevRange()
    }
  } 

  function nextRange(): void {
    changeDisplayYear(1);
  }

  function prevRange(): void {
    changeDisplayYear(-1);
  }

  function changeDisplayYear(offset: number): void {
    if (page.value === 1 && offset < 0) return;
    page.value += offset;
  }

  function changeMode(_mode: CalendarModeEnum) {
    mode.value = _mode;
  }

  function selectYear(year: Dayjs) {
    displayMonth.value = year;
    changeMode(CalendarModeEnum.Date);
  }

  onUnmounted(() => {
    yearsRef.value?.removeEventListener('wheel', onWheel)
  })
</script>

<template>
  <AppCalendarLayout
    @prev="prevRange"
    @next="nextRange"
  >
    <template #header>
      <section
        class="py-2 flex-1 font-semibold text-center"
      >
        {{ currentYearRange[0].date.format('YYYY') }} - {{ currentYearRange[11].date.format('YYYY') }}
      </section>
    </template>

    <section
      ref="yearsEl"
      class="grid grid-cols-3"
    >
      <button
        v-for="(cell, index) in currentYearRange"
        :key="index"
        :class="['text-center h-12 px-2 py-1 border text-typograph-200 hover:bg-accent-500/30', cell.isThisYear ? 'border-accent-600' : 'border-transparent']"
        @click="() => selectYear(cell.date)"
      >
        {{ cell.date.format('YYYY') }}
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