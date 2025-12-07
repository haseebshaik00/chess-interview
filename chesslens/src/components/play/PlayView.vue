<template>
    <div class="h-full flex flex-col md:flex-row gap-4">
        <!-- Left: Interactive board -->
        <div class="flex-1 flex flex-col items-center justify-center overflow-hidden">
            <div class="w-full max-w-xl aspect-square bg-slate-800 rounded-2xl shadow-lg p-3">
                <ChessBoard :fen="currentFen" :last-move="lastMove" :selected-square="selectedSquare"
                    :interactive="true" @squareClick="handleSquareClick" />
            </div>

            <!-- Controls -->
            <div class="mt-4 flex gap-3">
                <button class="px-3 py-1 rounded-full text-xs font-semibold border border-slate-400/60
                   bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100" @click="handleResetGame">
                    ⟲ New game
                </button>
                <button class="px-3 py-1 rounded-full text-xs font-semibold border border-slate-400/60
                   bg-emerald-500 text-white disabled:bg-slate-400 disabled:text-slate-900" @click="requestBestMove">
                    💡 Best move
                </button>
            </div>
        </div>

        <!-- Right: Best move panel -->
        <div class="w-full md:w-[26rem] flex flex-col gap-4 h-full">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow p-4 flex-1 flex flex-col">
                <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Best move recommendation
                </h2>

                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Click <strong>Best move</strong> to ask Stockfish for a suggestion
                    in the current position.
                </p>

                <div class="mt-4 flex-1 flex flex-col gap-3 text-sm">
                    <div
                        class="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/40">
                        <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Current turn
                        </p>
                        <p class="mt-1 font-semibold">
                            {{ turnLabel }}
                        </p>
                    </div>

                    <div
                        class="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/40">
                        <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Best move
                        </p>
                        <p class="mt-1 font-mono">
                            <span v-if="bestMoveStatus === 'idle'">No suggestion yet.</span>
                            <span v-else-if="bestMoveStatus === 'loading'">Analyzing position…</span>
                            <span v-else-if="bestMoveStatus === 'error'">Engine error.</span>
                            <span v-else>
                                {{ bestMoveDisplay }}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 🔔 Game Over Modal -->
        <div
            v-if="showGameOverModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        >
            <div
                class="bg-slate-900 text-slate-100 rounded-2xl shadow-xl px-6 py-5 w-[90%] max-w-sm border border-slate-700"
            >
                <h2 class="text-lg font-semibold mb-2 text-center">
                    {{ winnerColor ? (winnerColor + ' wins!') : 'Game over' }}
                </h2>

                <p v-if="winnerColor" class="text-sm text-slate-300 text-center mb-4">
                    Checkmate! {{ winnerColor }} delivered the final blow.
                </p>
                <p v-else class="text-sm text-slate-300 text-center mb-4">
                    The game has ended.
                </p>

                <div class="flex gap-3 mt-2">
                    <button
                        class="flex-1 py-2 rounded-full text-sm font-semibold bg-emerald-500 text-white"
                        @click="handleResetGame"
                    >
                        ⟲ New game
                    </button>
                    <button
                        class="flex-1 py-2 rounded-full text-sm font-semibold border border-slate-500 text-slate-100"
                        @click="showGameOverModal = false"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue';
import { Chess } from 'chess.js';
import ChessBoard from '@/components/shared/ChessBoard.vue';

type LastMove = { from: string; to: string } | null;
type BestMoveStatus = 'idle' | 'loading' | 'done' | 'error';
const STORAGE_KEY = 'playFen'

export default defineComponent({
    components: {
        ChessBoard,
    },
    setup() {
        const game = ref(new Chess());
        const selectedSquare = ref<string | null>(null);
        const lastMove = ref<LastMove>(null);

        const bestMoveStatus = ref<BestMoveStatus>('idle');
        const bestMoveUci = ref<string | null>(null);
        const stockfishWorker = ref<Worker | null>(null);
        // Game over modal state
        const showGameOverModal = ref(false);
        const winnerColor = ref<'White' | 'Black' | null>(null);

        function persistFen(): void {
            if (typeof window === 'undefined') {
                return;
            }
            window.localStorage.setItem(STORAGE_KEY, game.value.fen());
        }


        function loadFromStorage(): void {
            if (typeof window === 'undefined') {
                return;
            }

            const storedFen = window.localStorage.getItem(STORAGE_KEY);
            if (!storedFen) {
                return;
            }

            try {
                // chess.js constructor accepts a FEN directly
                const temp = new Chess(storedFen as any);
                game.value = temp;
            } catch (err) {
                console.warn('Failed to load stored FEN, clearing it:', err);
                window.localStorage.removeItem(STORAGE_KEY);
            }
        }


        const currentFen = computed(function () {
            return game.value.fen();
        });

        const turnLabel = computed(function () {
            return game.value.turn() === 'w' ? 'White to move' : 'Black to move';
        });

        // Put this helper *above* bestMoveDisplay inside setup()
        function describeBestMove(uci: string): string {
            if (!uci || uci.length < 4) return '';

            const from = uci.slice(0, 2); // e2
            const to = uci.slice(2, 4);   // e4

            const chess = game.value;
            const piece = chess.get(from as any);

            const pieceNames: Record<string, string> = {
                p: 'pawn',
                n: 'knight',
                b: 'bishop',
                r: 'rook',
                q: 'queen',
                k: 'king',
            };

            if (piece) {
                const color = piece.color === 'w' ? 'White' : 'Black';
                const pieceName = pieceNames[piece.type] || 'piece';
                return `Move ${color} ${pieceName} from ${from} to ${to}`;
            }

            // Fallback if something weird happens
            return `Move from ${from} to ${to}`;
        }

        const bestMoveDisplay = computed(function () {
            if (!bestMoveUci.value) return '';
            return describeBestMove(bestMoveUci.value);
        });

//         function handleSquareClick(coord: string): void {
//             var chess = game.value;

//             if (selectedSquare.value === null) {
//                 var piece = chess.get(coord as any);
//                 if (piece && piece.color === chess.turn()) {
//                     selectedSquare.value = coord;
//                 } else {
//                     selectedSquare.value = null;
//                 }
//                 return;
//             }

//             if (selectedSquare.value === coord) {
//                 selectedSquare.value = null;
//                 return;
//             }

//             var move = chess.move(
//                 {
//                     from: selectedSquare.value,
//                     to: coord,
//                     promotion: 'q',
//                 },
//                 { sloppy: true } as any
//             );

//             // if (move) {
//             //     lastMove.value = { from: move.from, to: move.to };
//             //     selectedSquare.value = null;

//             //     // IMPORTANT: save new position
//             //     persistFen();

//             //     bestMoveStatus.value = 'idle';
//             //     bestMoveUci.value = null;
//             // } else {
//             //     var pieceAt = chess.get(coord as any);
//             //     if (pieceAt && pieceAt.color === chess.turn()) {
//             //         selectedSquare.value = coord;
//             //     } else {
//             //         selectedSquare.value = null;
//             //     }
//             // }
//             if (move) {
//         lastMove.value = { from: move.from, to: move.to };
//         selectedSquare.value = null;

//         // IMPORTANT: save new position
//         persistFen();

//         bestMoveStatus.value = 'idle';
//         bestMoveUci.value = null;

//         // 🔔 Check if game is over (chess.js uses game_over() / in_checkmate())
//        // 🔔 Check if game is over
// if (chess.isGameOver()) {
//     if (chess.isCheckmate()) {
//         // After checkmate, chess.turn() is the *losing* side,
//         // so winner is the opposite color.
//         const winning = chess.turn() === 'w' ? 'Black' : 'White';
//         winnerColor.value = winning as 'White' | 'Black';
//     } else {
//         // (optional: stalemate/draw later: stalemate, draw, etc.)
//         winnerColor.value = null;
//     }

//     showGameOverModal.value = true;
// }

//     } else {
//         var pieceAt = chess.get(coord as any);
//         if (pieceAt && pieceAt.color === chess.turn()) {
//             selectedSquare.value = coord;
//         } else {
//             selectedSquare.value = null;
//         }
//     }

//         }

function handleSquareClick(coord: string): void {
    const chess = game.value;
    const pieceAt = chess.get(coord as any);

    // 🔹 No piece selected yet → select your own piece (if any)
    if (!selectedSquare.value) {
        if (pieceAt && pieceAt.color === chess.turn()) {
            selectedSquare.value = coord;
        }
        return;
    }

    // 🔹 Click same square → deselect
    if (selectedSquare.value === coord) {
        selectedSquare.value = null;
        return;
    }

    // 🔹 Click a different own piece → switch selection directly
    if (pieceAt && pieceAt.color === chess.turn()) {
        selectedSquare.value = coord;
        return;
    }

    // 🔹 Otherwise, try to make a move from the selected square to this coord
    const move = chess.move(
        {
            from: selectedSquare.value,
            to: coord,
            promotion: 'q',
        },
        { sloppy: true } as any
    );

    if (move) {
        lastMove.value = { from: move.from, to: move.to };
        selectedSquare.value = null;

        // Save new position
        persistFen();

        bestMoveStatus.value = 'idle';
        bestMoveUci.value = null;

        // ✅ Game over / winner modal
        if (chess.isGameOver()) {
            if (chess.isCheckmate()) {
                // After checkmate, chess.turn() is the loser → opposite color wins
                const winning = chess.turn() === 'w' ? 'Black' : 'White';
                winnerColor.value = winning as 'White' | 'Black';
            } else {
                winnerColor.value = null; // stalemate/draw etc. (can extend later)
            }
            showGameOverModal.value = true;
        }
    } else {
        // Illegal destination: keep current selection so user can try another square
        // (intentionally do nothing)
    }
}



        function handleResetGame(): void {
    game.value = new Chess();
    selectedSquare.value = null;
    lastMove.value = null;
    bestMoveStatus.value = 'idle';
    bestMoveUci.value = null;

    // 🔔 Reset modal
    winnerColor.value = null;
    showGameOverModal.value = false;

    if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY);
    }
}


        // ---------- STOCKFISH: use engine file directly as a worker ----------
        function ensureWorker(): void {
            if (stockfishWorker.value) return;

            // stockfish.js is in public/stockfish/stockfish.js
            const worker = new Worker('/stockfish/stockfish.js');

            // Basic init
            worker.postMessage('uci');

            stockfishWorker.value = worker;
        }

        function requestBestMove(): void {
            ensureWorker();
            const engine = stockfishWorker.value;
            if (!engine) return;

            bestMoveStatus.value = 'loading';
            bestMoveUci.value = null;

            const fen = game.value.fen();

            // Listen for bestmove from engine
            engine.onmessage = function (event: MessageEvent) {
                const text = typeof event.data === 'string' ? event.data : (event.data && event.data.data);
                if (typeof text !== 'string') return;

                if (text.startsWith('bestmove')) {
                    const parts = text.split(' ');
                    const bestMove = parts[1] || null;
                    bestMoveStatus.value = 'done';
                    bestMoveUci.value = bestMove;
                }
            };

            engine.postMessage('position fen ' + fen);
            engine.postMessage('go depth 12');
        }

        onMounted(function () {
            loadFromStorage();
        });

        return {
            currentFen,
    selectedSquare,
    lastMove,
    turnLabel,
    bestMoveStatus,
    bestMoveDisplay,
    handleSquareClick,
    handleResetGame,
    requestBestMove,
    showGameOverModal,
    winnerColor,
        };
    },
});
</script>