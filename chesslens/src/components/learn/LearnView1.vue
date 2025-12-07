<template>
    <div class="h-full flex flex-col md:flex-row gap-4">
      <!-- Board area -->
      <div class="flex-1 flex items-center justify-center overflow-hidden">
        <div class="h-full w-full max-w-3xl aspect-square bg-slate-800 rounded-2xl shadow-lg p-3">
          <!-- ChessBoard -->
          <div class="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-slate-200 text-sm">
            ChessBoard (Learn Mode)
          </div>
        </div>
      </div>
  
      <!-- Right panel: selector + description -->
      <div class="w-full md:w-[28rem] flex flex-col gap-4 h-full">
        <OpeningSelector />
        <OpeningDetails />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted } from 'vue';
  import OpeningSelector from './OpeningSelector.vue';
  import OpeningDetails from './OpeningDetails.vue';
  import { useOpeningStore } from '@/stores/openingStore';
  
  export default defineComponent({
    components: {
      OpeningSelector,
      OpeningDetails,
    },
    setup() {
      const openingStore = useOpeningStore();
  
      onMounted(() => {
        openingStore.loadFromStorage();
      });
  
      return {};
    },
  });
  </script>
  