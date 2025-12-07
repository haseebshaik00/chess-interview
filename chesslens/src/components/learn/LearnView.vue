<template>
    <div class="h-full flex flex-col md:flex-row gap-4">
      <!-- Left: Board + controls -->
      <div class="flex-1 flex flex-col items-center justify-center overflow-hidden">
        <div
          class="w-full max-w-xl aspect-square bg-slate-800 rounded-2xl shadow-lg p-3"
        >
          <ChessBoard
            :fen="currentFen"
            :last-move="lastMove"
            :interactive="false"
          />
        </div>
  
        <!-- Controls -->
        <div class="mt-4 flex gap-3">
          <button
            class="px-3 py-1 rounded-full text-xs font-semibold border border-slate-400/60
                   bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
            @click="handleStepForward"
            :disabled="!canStep"
          >
            ▶ Step
          </button>
          <button
            class="px-3 py-1 rounded-full text-xs font-semibold border border-slate-400/60
                   bg-emerald-500 text-white disabled:bg-slate-400 disabled:text-slate-900"
            @click="handleTogglePlay"
            :disabled="!hasOpening"
          >
            {{ isPlaying ? 'Pause' : 'Play' }}
          </button>
          <button
            class="px-3 py-1 rounded-full text-xs font-semibold border border-slate-400/60
                   bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
            @click="handleReset"
            :disabled="!hasOpening"
          >
            ⟲ Reset
          </button>
        </div>
      </div>
  
      <!-- Right: selector + description -->
      <div class="w-full md:w-[26rem] flex flex-col gap-4 h-full">
        <OpeningSelector />
        <OpeningDetails class="flex-1" />
      </div>
    </div>
  </template>c
  
  <script lang="ts">
  import {
    defineComponent,
    onMounted,
    onUnmounted,
    computed,
    ref,
    watch,
  } from 'vue';
  import { Chess } from 'chess.js';
  import { createActor, type StateFrom } from 'xstate';
  import { learnMachine } from '@/machines/learnMachine';
  import ChessBoard from '@/components/shared/ChessBoard.vue';
  import OpeningSelector from './OpeningSelector.vue';
  import OpeningDetails from './OpeningDetails.vue';
  import { useOpeningStore } from '@/stores/openingStore';
  
  type LearnState = StateFrom<typeof learnMachine>;
  
  export default defineComponent({
    components: {
      ChessBoard,
      OpeningSelector,
      OpeningDetails,
    },
    setup() {
      const openingStore = useOpeningStore();
  
      // --- XState actor setup ---
      const actor = createActor(learnMachine);
      const machineState = ref<LearnState>(actor.getSnapshot());
  
      actor.subscribe(function (state) {
        machineState.value = state;
      });
      actor.start();
  
      function send(eventType: 'SELECT_OPENING' | 'PLAY' | 'PAUSE' | 'RESET' | 'STOP'): void {
        actor.send({ type: eventType });
      }
  
      let autoplayTimerId: number | null = null;
  
      function startAutoPlay(): void {
        if (autoplayTimerId !== null) {
          return;
        }
        autoplayTimerId = window.setInterval(function () {
          const opening = openingStore.selectedOpening;
          if (!opening) {
            stopAutoPlay();
            return;
          }
          if (openingStore.currentMoveIndex >= opening.moves.length) {
            send('STOP');
            stopAutoPlay();
            return;
          }
          openingStore.stepForward();
        }, 800);
      }
  
      function stopAutoPlay(): void {
        if (autoplayTimerId !== null) {
          window.clearInterval(autoplayTimerId);
          autoplayTimerId = null;
        }
      }
  
      // Compute FEN + last move from current state
      function buildPosition() {
        const chess = new Chess();
        const opening = openingStore.selectedOpening;
        let last: any = null;
  
        if (opening) {
          for (let i = 0; i < openingStore.currentMoveIndex; i += 1) {
            last = chess.move(opening.moves[i], { sloppy: true });
          }
        }
  
        return {
          fen: chess.fen(),
          lastMove: last ? { from: last.from, to: last.to } : null,
        };
      }
  
      const currentFen = computed(function () {
        return buildPosition().fen;
      });
  
      const lastMove = computed(function () {
        return buildPosition().lastMove;
      });
  
      const hasOpening = computed(function () {
        return !!openingStore.selectedOpening;
      });
  
      const isPlaying = computed(function () {
        return machineState.value.matches('playing');
      });
  
      const canStep = computed(function () {
        if (!openingStore.selectedOpening) {
          return false;
        }
        return (
          openingStore.currentMoveIndex < openingStore.selectedOpening.moves.length
        );
      });
  
      function handleStepForward(): void {
        if (!openingStore.selectedOpening) {
          return;
        }
        if (
          openingStore.currentMoveIndex <
          openingStore.selectedOpening.moves.length
        ) {
          openingStore.stepForward();
        }
      }
  
      function handleReset(): void {
        openingStore.resetLine();
        send('RESET');
        stopAutoPlay();
      }
  
      function handleTogglePlay(): void {
        if (!openingStore.selectedOpening) {
          return;
        }
        if (machineState.value.matches('playing')) {
          send('PAUSE');
          stopAutoPlay();
        } else {
          send('PLAY');
          startAutoPlay();
        }
      }
  
      // When opening changes, move machine out of idle
      watch(
        function () {
          return openingStore.selectedOpeningId;
        },
        function (newId) {
          if (newId) {
            send('SELECT_OPENING');
            stopAutoPlay();
          } else {
            // back to initial
            actor.stop();
          }
        }
      );
  
      onMounted(function () {
        openingStore.loadFromStorage();
        if (openingStore.selectedOpening) {
          send('SELECT_OPENING');
        }
      });
  
      onUnmounted(function () {
        stopAutoPlay();
        actor.stop();
      });
  
      return {
        currentFen,
        lastMove,
        hasOpening,
        isPlaying,
        canStep,
        handleStepForward,
        handleReset,
        handleTogglePlay,
      };
    },
  });
  </script>
  