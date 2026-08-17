import {renderBackboneView as render} from 'pageflow/testHelpers';

import {LottieFile} from 'contentElements/lottieAnimation/editor/models/LottieFile';
import {
  LottieFilePositioningView
} from 'contentElements/lottieAnimation/editor/views/LottieFilePositioningView';

import {fakeDotLottiePlayers} from 'support/fakeDotLottiePlayers';

jest.mock('@lottiefiles/dotlottie-web', () => ({
  DotLottie: Object.assign(jest.fn(), {setWasmUrl: jest.fn()})
}));

describe('LottieFilePositioningView', () => {
  const {players, setAnimationSize} = fakeDotLottiePlayers();

  function positioningView(options) {
    return new LottieFilePositioningView({
      model: new LottieFile({
        state: 'uploaded',
        original_url: '/animation.lottie'
      }),
      fit: 'contain',
      ...options
    });
  }

  it('renders animation of the file in a canvas', () => {
    const view = positioningView();

    render(view);

    expect(players).toHaveLength(1);
    expect(players[0].config.src).toEqual('/animation.lottie');
    expect(players[0].config.canvas).toBe(view.el.querySelector('canvas'));
  });

  it('plays the animation in a loop', () => {
    render(positioningView());

    expect(players[0].config.autoplay).toBe(true);
    expect(players[0].config.loop).toBe(true);
  });

  it('applies the given fit', () => {
    render(positioningView({fit: 'cover'}));

    expect(players[0].config.layout.fit).toEqual('cover');
  });

  it('aligns the animation according to the position', () => {
    const view = positioningView({fit: 'cover'});

    render(view);
    players[0].emit('load');
    view.setPosition(20, 30);

    expect(players[0].setLayout).toHaveBeenLastCalledWith({fit: 'cover', align: [0.2, 0.3]});
  });

  it('applies position set while the animation was still loading', () => {
    const view = positioningView({fit: 'cover'});

    render(view);
    view.setPosition(20, 30);
    players[0].setLayout.mockClear();
    players[0].emit('load');

    expect(players[0].setLayout).toHaveBeenCalledWith({fit: 'cover', align: [0.2, 0.3]});
  });

  it('sizes itself to the animation once it has loaded', () => {
    setAnimationSize({width: 200, height: 100});
    const view = positioningView();

    render(view);
    players[0].emit('load');

    expect(view.el.style.getPropertyValue('--positioning-aspect-ratio')).toEqual('2');
    expect(view.el.style.getPropertyValue('--positioning-width')).toEqual('200px');
  });

  it('destroys player when closed', () => {
    const view = positioningView();
    render(view);

    view.close();

    expect(players[0].destroy).toHaveBeenCalled();
  });
});
