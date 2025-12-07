import { createMachine } from 'xstate';

export const learnMachine = createMachine({
  id: 'learn',
  initial: 'idle',
  states: {
    idle: {
      on: {
        SELECT_OPENING: 'paused',
      },
    },
    paused: {
      on: {
        PLAY: 'playing',
        RESET: 'paused',
        SELECT_OPENING: 'paused',
      },
    },
    playing: {
      on: {
        PAUSE: 'paused',
        STOP: 'paused',
        SELECT_OPENING: 'playing',
      },
    },
  },
});
