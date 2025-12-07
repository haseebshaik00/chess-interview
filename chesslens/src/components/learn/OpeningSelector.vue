<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl shadow p-4">
    <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
      Choose an opening
    </h2>
    <select
      class="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-2 py-1 text-sm
             bg-slate-50 dark:bg-slate-800 dark:text-slate-100"
      v-model="selectedId"
      @change="handleChange"
    >
      <option value="">Select...</option>
      <option
        v-for="o in openings"
        :key="o.id"
        :value="o.id"
      >
        {{ o.name }} ({{ o.eco }})
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import { useOpeningStore } from '@/stores/openingStore';

export default defineComponent({
  setup() {
    const store = useOpeningStore();
    const openings = computed(() => store.openings);
    const selectedId = ref<string | ''>('');

    watch(
      () => store.selectedOpening,
      (opening) => {
        selectedId.value = opening ? opening.id : '';
      },
      { immediate: true }
    );

    function handleChange(): void {
      if (selectedId.value) {
        store.selectOpening(selectedId.value);
      }
    }

    return {
      openings,
      selectedId,
      handleChange,
    };
  },
});
</script>
