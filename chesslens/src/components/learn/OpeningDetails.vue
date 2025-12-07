<template>
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow p-4 flex flex-col gap-2 min-h-[200px]">
      <template v-if="opening">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-slate-800 dark:text-slate-100">
              {{ opening.name }}
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              ECO: {{ opening.eco }} • Side: {{ opening.side === 'white' ? 'White' : 'Black' }}
            </p>
          </div>
          <span class="accent-pill">
            Learn
          </span>
        </div>
  
        <p class="text-sm text-slate-700 dark:text-slate-200 mt-2">
          {{ opening.description }}
        </p>
  
        <div class="mt-2">
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Key ideas
          </h3>
          <ul class="list-disc list-inside text-sm text-slate-700 dark:text-slate-200 space-y-1">
            <li v-for="idea in opening.ideas" :key="idea">
              {{ idea }}
            </li>
          </ul>
        </div>
      </template>
      <template v-else>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Select an opening to see a explanation and key ideas.
        </p>
      </template>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useOpeningStore } from '@/stores/openingStore';
  
  export default defineComponent({
    setup() {
      const store = useOpeningStore();
      const opening = computed(() => store.selectedOpening);
  
      return {
        opening,
      };
    },
  });
  </script>
  