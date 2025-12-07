<template>
    <div class="h-full flex flex-col md:flex-row gap-4">
        <div class="flex-1 flex items-center justify-center overflow-hidden">
            <div class="h-full w-full max-w-3xl aspect-square bg-slate-800 rounded-2xl shadow-lg p-3">
                <div
                    class="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-slate-200 text-sm">
                    ChessBoard (Play Mode)
                </div>
            </div>
        </div>

        <div class="w-full md:w-[28rem] flex flex-col gap-4 h-full">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow p-4 flex-1">
                <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Best move recommendation
                </h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Stockfish integration will go here.
                </p>
                <!-- Placeholder -->
                <div class="mt-4 h-full flex flex-col gap-3 text-xs text-slate-400">
                    <div class="rounded-lg border border-dashed border-slate-300/50 dark:border-slate-700/70 p-3">
                        Current position eval, suggested move, and explanation will appear here.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>