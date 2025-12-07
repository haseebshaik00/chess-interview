<template>
    <div class="w-full h-full grid grid-rows-8 grid-cols-8 rounded-xl overflow-hidden">
        <div v-for="square in squares" :key="square.coord"
            class="relative flex items-center justify-center text-4xl md:text-5xl font-semibold cursor-pointer select-none"
            :class="[
                square.isDark ? 'bg-slate-700' : 'bg-slate-300',        // higher contrast light squares
                square.isLastMove ? 'ring-4 ring-emerald-400/70 ring-inset' : '',
            ]" @click="handleSquareClick(square.coord)">
            <div v-if="interactive && selectedSquare === square.coord"
                class="pointer-events-none absolute inset-0 rounded-lg border-4 border-amber-400"></div>
            
            <!-- Piece -->
            <span v-if="square.pieceSymbol" class="drop-shadow-600"
                :class="square.isWhitePiece ? 'text-yellow-100' : 'text-slate-900'">
                {{ square.unicode }}
            </span>

            <!-- File letter (a–h) on bottom rank -->
            <span v-if="square.showFileLabel"
                class="absolute bottom-1 right-2 text-[12px] md:text-[12px] font-bold text-red-600">
                {{ square.file }}
            </span>

            <!-- Rank number (1–8) on a-file -->
            <span v-if="square.showRankLabel"
                class="absolute top-1 left-1 text-[12px] md:text-[12px] font-bold text-red-600">
                {{ square.rank }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';

type LastMove = { from: string; to: string } | null;

interface SquareView {
    coord: string;
    file: string;
    rank: number;
    pieceSymbol: string | null;
    unicode: string | null;
    isDark: boolean;
    isWhitePiece: boolean;
    isLastMove: boolean;
    isSelected: boolean;
    showFileLabel: boolean;
    showRankLabel: boolean;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

function pieceToUnicode(symbol: string): string {
    const map: Record<string, string> = {
        p: '♟',
        r: '♜',
        n: '♞',
        b: '♝',
        q: '♛',
        k: '♚',
        P: '♙',
        R: '♖',
        N: '♘',
        B: '♗',
        Q: '♕',
        K: '♔',
    };
    return map[symbol] || '';
}

function parseFenBoard(fen: string): string[][] {
    const boardPart = fen.split(' ')[0];
    const rows = boardPart.split('/');
    const board: string[][] = [];

    for (let i = 0; i < rows.length; i += 1) {
        const rowStr = rows[i];
        const row: string[] = [];
        for (let j = 0; j < rowStr.length; j += 1) {
            const ch = rowStr.charAt(j);
            const num = Number(ch);
            if (!Number.isNaN(num)) {
                for (let k = 0; k < num; k += 1) row.push('');
            } else {
                row.push(ch);
            }
        }
        board.push(row);
    }
    return board;
}

export default defineComponent({
    name: 'ChessBoard',
    props: {
        fen: {
            type: String,
            required: true,
        },
        lastMove: {
            type: Object as PropType<LastMove>,
            default: null,
        },
        selectedSquare: {
            type: String,
            default: null,
        },
        interactive: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['squareClick'],
    setup(props, ctx) {
        const squares = computed(function () {
            const board = parseFenBoard(props.fen);
            const result: SquareView[] = [];

            // board[0] = rank 8 (top), board[7] = rank 1 (bottom)
            for (let rankIndex = 0; rankIndex < 8; rankIndex += 1) {
                const row = board[rankIndex];
                const rankNumber = 8 - rankIndex;

                for (let fileIndex = 0; fileIndex < 8; fileIndex += 1) {
                    const fileLetter = FILES[fileIndex];
                    const coord = fileLetter + String(rankNumber);

                    const symbol = row[fileIndex] || '';
                    const isDark = (rankIndex + fileIndex) % 2 === 1;
                    const isWhitePiece = symbol !== '' && symbol === symbol.toUpperCase();
                    const unicode = symbol ? pieceToUnicode(symbol) : null;

                    let isLastMove = false;
                    if (
                        props.lastMove &&
                        (props.lastMove.from === coord || props.lastMove.to === coord)
                    ) {
                        isLastMove = true;
                    }

                    const isSelected = props.selectedSquare === coord;

                    const showFileLabel = rankNumber === 1;      // bottom rank
                    const showRankLabel = fileIndex === 0;       // a-file

                    result.push({
                        coord,
                        file: fileLetter,
                        rank: rankNumber,
                        pieceSymbol: symbol || null,
                        unicode,
                        isDark,
                        isWhitePiece,
                        isLastMove,
                        isSelected,
                        showFileLabel,
                        showRankLabel,
                    });
                }
            }

            return result;
        });

        function handleSquareClick(coord: string): void {
            if (!props.interactive) return;
            ctx.emit('squareClick', coord);
        }

        return {
            squares,
            handleSquareClick,
        };
    },
});
</script>