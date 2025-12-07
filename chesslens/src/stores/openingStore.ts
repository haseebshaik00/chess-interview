import { defineStore } from 'pinia';
import type { Opening } from '@/data/openings';
import { openings as openingList } from '@/data/openings';

interface OpeningState {
  openings: Opening[];
  selectedOpeningId: string | null;
  currentMoveIndex: number;
}

export const useOpeningStore = defineStore('opening', {
  state(): OpeningState {
    return {
      openings: openingList,
      selectedOpeningId: null,
      currentMoveIndex: 0,
    };
  },
  getters: {
    selectedOpening(state): Opening | null {
      return state.openings.find(o => o.id === state.selectedOpeningId) || null;
    },
  },
  actions: {
    selectOpening(id: string): void {
      this.selectedOpeningId = id;
      this.currentMoveIndex = 0;
      window.localStorage.setItem('selectedOpeningId', id);
    },
    loadFromStorage(): void {
      const id = window.localStorage.getItem('selectedOpeningId');
      if (id && this.openings.some(o => o.id === id)) {
        this.selectedOpeningId = id;
      }
    },
    stepForward(): void {
      if (!this.selectedOpening) return;
      if (this.currentMoveIndex < this.selectedOpening.moves.length) {
        this.currentMoveIndex += 1;
      }
    },
    resetLine(): void {
      this.currentMoveIndex = 0;
    },
  },
});
