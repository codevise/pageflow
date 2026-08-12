import React from 'react';
import {act} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';

import {LottieAnimation} from 'contentElements/lottieAnimation/LottieAnimation';
import {DotLottie} from '@lottiefiles/dotlottie-web';

import {fakeDotLottiePlayers} from 'support/fakeDotLottiePlayers';

jest.mock('@lottiefiles/dotlottie-web', () => ({
  DotLottie: Object.assign(jest.fn(), {setWasmUrl: jest.fn()})
}));

describe('LottieAnimation', () => {
  const {players, setAnimationSize} = fakeDotLottiePlayers({act});

  function renderLottieAnimation({
    configuration = {id: 100},
    scrollPosition = 'in viewport',
    ...seedOptions
  } = {}) {
    const result = renderInContentElement(
      <LottieAnimation contentElementId={42} configuration={configuration} />,
      {
        seed: {
          fileUrlTemplates: {
            lottieFiles: {original: ':id_partition/:basename.:extension'}
          },
          lottieFiles: [
            {id: 1, permaId: 100, basename: 'animation', extension: 'lottie'}
          ],
          ...seedOptions
        }
      }
    );

    result.simulateScrollPosition(scrollPosition);

    return result;
  }

  it('loads WebAssembly module from own bundle instead of a CDN', () => {
    expect(DotLottie.setWasmUrl).toHaveBeenCalledWith('wasm-url-stub');
  });

  it('renders animation of selected file', () => {
    renderLottieAnimation();

    expect(players).toHaveLength(1);
    expect(players[0].config.src).toEqual('000/000/001/animation.lottie');
  });

  it('does not create player before element is near viewport', () => {
    renderLottieAnimation({scrollPosition: 'outside viewport'});

    expect(players).toHaveLength(0);
  });

  it('does not create player if no file is selected', () => {
    renderLottieAnimation({configuration: {}});

    expect(players).toHaveLength(0);
  });

  it('loops by default', () => {
    renderLottieAnimation();

    expect(players[0].config.loop).toBe(true);
  });

  it('does not loop in playOnce playback mode', () => {
    renderLottieAnimation({configuration: {id: 100, playbackMode: 'playOnce'}});

    expect(players[0].config.loop).toBe(false);
  });

  it('plays animation once it has loaded while element is visible', () => {
    renderLottieAnimation({scrollPosition: 'in viewport'});

    players[0].emit('load');

    expect(players[0].play).toHaveBeenCalled();
  });

  it('does not play animation while element is not visible', () => {
    renderLottieAnimation({scrollPosition: 'near viewport'});

    players[0].emit('load');

    expect(players[0].play).not.toHaveBeenCalled();
  });

  it('pauses animation when element leaves viewport', () => {
    const {simulateScrollPosition} = renderLottieAnimation({scrollPosition: 'in viewport'});
    players[0].emit('load');

    simulateScrollPosition('near viewport');

    expect(players[0].pause).toHaveBeenCalled();
  });

  it('destroys player on unmount', () => {
    const {unmount} = renderLottieAnimation();

    unmount();

    expect(players[0].destroy).toHaveBeenCalled();
  });

  it('applies aspect ratio of animation once it has loaded', () => {
    setAnimationSize({width: 200, height: 100});
    const {container} = renderLottieAnimation();

    players[0].emit('load');

    expect(container.querySelector('[style*="--fit-viewport-aspect-ratio: 0.5"]'))
      .not.toBeNull();
  });
});
