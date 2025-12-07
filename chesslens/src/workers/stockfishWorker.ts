/// <reference lib="webworker" />
const ctx: DedicatedWorkerGlobalScope = self as any;

let engine: any = null;

function initEngine(): void {
  if (engine) return;

  // Load JS Stockfish from public folder
  importScripts('/stockfish/stockfish.js');
  engine = (self as any).Stockfish();

  engine.postMessage('uci');
}

ctx.onmessage = function (event: MessageEvent) {
  const data = event.data;

  if (data.type === 'init') {
    initEngine();
    return;
  }

  if (data.type === 'analyze') {
    if (!engine) initEngine();

    const fen: string = data.fen;
    const depth: number = data.depth || 12;

    engine.onmessage = function (line: any) {
      const text = typeof line === 'string' ? line : line.data;
      if (typeof text !== 'string') return;

      if (text.startsWith('bestmove')) {
        const parts = text.split(' ');
        const bestMove = parts[1] || null;
        ctx.postMessage({
          type: 'result',
          bestMove: bestMove,
        });
      }
    };

    engine.postMessage('position fen ' + fen);
    engine.postMessage('go depth ' + depth);
  }
};
