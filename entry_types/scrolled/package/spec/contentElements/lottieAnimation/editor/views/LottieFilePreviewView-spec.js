import {renderBackboneView as render} from 'pageflow/testHelpers';

import {LottieFile} from 'contentElements/lottieAnimation/editor/models/LottieFile';
import {
  LottieFilePreviewView
} from 'contentElements/lottieAnimation/editor/views/LottieFilePreviewView';

import {fakeDotLottiePlayers} from 'support/fakeDotLottiePlayers';

jest.mock('@lottiefiles/dotlottie-web', () => ({
  DotLottie: Object.assign(jest.fn(), {setWasmUrl: jest.fn()})
}));

describe('LottieFilePreviewView', () => {
  const {players, setAnimationSize} = fakeDotLottiePlayers();

  function previewView(attributes) {
    return new LottieFilePreviewView({
      model: new LottieFile({
        state: 'uploaded',
        original_url: '/animation.lottie',
        ...attributes
      })
    });
  }

  it('renders animation of the file in a canvas', () => {
    const view = previewView();

    render(view);

    expect(players).toHaveLength(1);
    expect(players[0].config.src).toEqual('/animation.lottie');
    expect(players[0].config.canvas).toBe(view.el.querySelector('canvas'));
  });

  it('plays the animation in a loop', () => {
    render(previewView());

    expect(players[0].config.autoplay).toBe(true);
    expect(players[0].config.loop).toBe(true);
  });

  it('applies aspect ratio of animation once it has loaded', () => {
    setAnimationSize({width: 200, height: 100});
    const view = previewView();
    render(view);

    players[0].emit('load');

    const canvas = view.el.querySelector('canvas');

    expect(canvas.style.getPropertyValue('--preview-aspect-ratio')).toEqual('200 / 100');
    expect(canvas.style.getPropertyValue('--preview-width')).toEqual('200px');
  });

  it('destroys player when closed', () => {
    const view = previewView();
    render(view);

    view.close();

    expect(players[0].destroy).toHaveBeenCalled();
  });
});
