import {renderBackboneView as render} from 'pageflow/testHelpers';

import {LottieFile} from 'contentElements/lottieAnimation/editor/models/LottieFile';
import {
  LottieFileThumbnailView
} from 'contentElements/lottieAnimation/editor/views/LottieFileThumbnailView';

import {fakeDotLottiePlayers} from 'support/fakeDotLottiePlayers';

jest.mock('@lottiefiles/dotlottie-web', () => ({
  DotLottie: Object.assign(jest.fn(), {setWasmUrl: jest.fn()})
}));

describe('LottieFileThumbnailView', () => {
  const {players, setTotalFrames} = fakeDotLottiePlayers();

  function thumbnailView(attributes) {
    return new LottieFileThumbnailView({
      model: new LottieFile({
        state: 'uploaded',
        original_url: '/animation.lottie',
        ...attributes
      })
    });
  }

  it('renders animation of the file in a canvas', () => {
    const view = thumbnailView();

    render(view);

    expect(players).toHaveLength(1);
    expect(players[0].config.src).toEqual('/animation.lottie');
    expect(players[0].config.canvas).toBe(view.el.querySelector('canvas'));
  });

  it('seeks to the last frame of the animation once it has loaded', () => {
    setTotalFrames(60);
    const view = thumbnailView();

    render(view);
    players[0].emit('load');

    expect(players[0].setFrame).toHaveBeenCalledWith(59);
  });

  it('crops the animation to fill the thumbnail', () => {
    const view = thumbnailView();

    render(view);

    expect(players[0].config.layout).toEqual({fit: 'cover'});
  });

  it('does not play the animation', () => {
    const view = thumbnailView();

    render(view);
    players[0].emit('load');

    expect(players[0].config.autoplay).toBe(false);
    expect(players[0].play).not.toHaveBeenCalled();
  });

  it('destroys player when closed', () => {
    const view = thumbnailView();
    render(view);

    view.close();

    expect(players[0].destroy).toHaveBeenCalled();
  });
});
