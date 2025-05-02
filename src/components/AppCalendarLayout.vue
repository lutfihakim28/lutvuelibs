<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';


  const emit = defineEmits<{
    prev: [],
    next: [],
  }>()
</script>

<template>
  <section class="flex items-stretch">
    <button
      class="hover:bg-primary-200/20 p-2 w-12 h-12 grid place-content-center"
      @click="emit('prev')"
    >
      <ChevronLeftIcon class="size-6" />
    </button>
    <section class="flex-1 flex items-center">
      <slot name="header" />
    </section>
    <button
      class="hover:bg-primary-200/20 p-2 w-12 h-12 grid place-content-center"
      @click="emit('next')"
    >
      <ChevronRightIcon class="size-6" />
    </button>
  </section>
  <slot />
  <section class="mt-2">
    <slot name="footer" />
  </section>
</template>