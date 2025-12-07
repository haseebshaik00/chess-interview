<template>
  <div class="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
      <div class="flex items-center gap-2">
        <span class="font-bold text-lg">ChessLens</span>
        <span class="text-xs text-slate-500 dark:text-slate-400">
          Opening Visualizer &amp; Real-time Best Move Helper
        </span>
      </div>

      <div class="flex items-center gap-3">
        <!-- Mode toggle -->
        <div class="inline-flex rounded-full border border-slate-300 dark:border-slate-700 p-1 bg-slate-100 dark:bg-slate-800">
          <button
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="ui.mode === 'learn'
              ? 'bg-emerald-500 text-white'
              : 'text-slate-600 dark:text-slate-300'"
            @click="changeMode('learn')"
          >
            Learn
          </button>
          <button
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="ui.mode === 'play'
              ? 'bg-emerald-500 text-white'
              : 'text-slate-600 dark:text-slate-300'"
            @click="changeMode('play')"
          >
            Play
          </button>
        </div>

        <!-- Theme toggle -->
        <button
          class="px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 text-xs flex items-center gap-1 bg-slate-100 dark:bg-slate-800"
          @click="toggleTheme"
        >
          <span v-if="ui.theme === 'light'">🌙 Dark</span>
          <span v-else>☀️ Light</span>
        </button>
      </div>
    </header>

    <!-- Main area -->
    <main class="flex-1 p-4 md:p-6 overflow-hidden">
      <LearnView v-if="ui.mode === 'learn'" />
      <PlayView v-else />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useUiStore, type AppMode } from './stores/uiStore';
import LearnView from './components/learn/LearnView.vue';
import PlayView from './components/play/PlayView.vue';

export default defineComponent({
  components: {
    LearnView,
    PlayView,
  },
  setup() {
    const ui = useUiStore();

    function changeMode(mode: AppMode): void {
      ui.setMode(mode);
    }

    function toggleTheme(): void {
      const next = ui.theme === 'light' ? 'dark' : 'light';
      ui.setTheme(next);
    }

    onMounted(() => {
      ui.initFromStorage();
    });

    return {
      ui,
      changeMode,
      toggleTheme,
    };
  },
});
</script>
