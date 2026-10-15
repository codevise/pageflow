import {act} from '@testing-library/react';

export function createFakeScreenfull() {
  const handlers = [];

  return {
    isEnabled: true,
    isFullscreen: false,
    request: jest.fn(() => Promise.resolve()),
    exit: jest.fn(() => Promise.resolve()),

    on(event, handler) {
      handlers.push(handler);
    },

    off(event, handler) {
      const index = handlers.indexOf(handler);

      if (index >= 0) {
        handlers.splice(index, 1);
      }
    },

    simulateFullscreenChange(isFullscreen) {
      this.isFullscreen = isFullscreen;
      act(() => handlers.forEach(handler => handler()));
    }
  };
}
