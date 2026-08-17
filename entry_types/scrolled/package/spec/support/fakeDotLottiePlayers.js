import {DotLottie} from '@lottiefiles/dotlottie-web';

const defaultAnimationSize = {width: 100, height: 100};
const defaultTotalFrames = 10;

// Records the players created by the code under test in the returned
// `players` array and provides setters to control what those players
// report about the animation. Since the module factory of `jest.mock`
// is hoisted above imports, spec files have to mock the player module
// themselves:
//
//     jest.mock('@lottiefiles/dotlottie-web', () => ({
//       DotLottie: Object.assign(jest.fn(), {setWasmUrl: jest.fn()})
//     }));
//
// Pass React's `act` to wrap emitting player events when rendering
// components.
export function fakeDotLottiePlayers({act = fn => fn()} = {}) {
  const players = [];
  let animationSize;
  let totalFrames;

  beforeEach(() => {
    players.length = 0;
    animationSize = defaultAnimationSize;
    totalFrames = defaultTotalFrames;

    DotLottie.mockImplementation(function(config) {
      const listeners = {};

      Object.assign(this, {
        config,
        totalFrames,
        play: jest.fn(),
        pause: jest.fn(),
        setFrame: jest.fn(),
        setLayout: jest.fn(),
        resize: jest.fn(),
        destroy: jest.fn(),
        animationSize: jest.fn(() => animationSize),

        addEventListener(type, listener) {
          listeners[type] = listener;
        },

        emit(type) {
          act(() => listeners[type] && listeners[type]());
        }
      });

      players.push(this);
    });
  });

  return {
    players,

    setAnimationSize(size) {
      animationSize = size;
    },

    setTotalFrames(count) {
      totalFrames = count;
    }
  };
}
