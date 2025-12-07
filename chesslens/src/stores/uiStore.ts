import { defineStore } from 'pinia';

export type AppMode = 'learn' | 'play';
export type ThemeMode = 'light' | 'dark';

interface UiState {
  mode: AppMode;
  theme: ThemeMode;
}

export const useUiStore = defineStore('ui', {
  state(): UiState {
    return {
      mode: 'learn',
      theme: 'light',
    };
  },
  actions: {
    setMode(mode: AppMode): void {
      this.mode = mode;
      window.localStorage.setItem('appMode', mode);
    },
    setTheme(theme: ThemeMode): void {
      this.theme = theme;
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      window.localStorage.setItem('theme', theme);
    },
    initFromStorage(): void {
      const storedMode = window.localStorage.getItem('appMode') as AppMode | null;
      const storedTheme = window.localStorage.getItem('theme') as ThemeMode | null;

      if (storedMode === 'learn' || storedMode === 'play') {
        this.mode = storedMode;
      }
      if (storedTheme === 'light' || storedTheme === 'dark') {
        this.setTheme(storedTheme);
      } else {
        // default
        this.setTheme('light');
      }
    },
  },
});
