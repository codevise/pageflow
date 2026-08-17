import '@testing-library/jest-dom/extend-expect';

import {renderBackboneView as render} from 'pageflow/testHelpers';

import {LottieFile} from 'contentElements/lottieAnimation/editor/models/LottieFile';
import {
  LottieFilePlayerView
} from 'contentElements/lottieAnimation/editor/views/LottieFilePlayerView';

import {fakeDotLottiePlayers} from 'support/fakeDotLottiePlayers';

jest.mock('@lottiefiles/dotlottie-web', () => ({
  DotLottie: Object.assign(jest.fn(), {setWasmUrl: jest.fn()})
}));

describe('LottieFilePlayerView', () => {
  const {players} = fakeDotLottiePlayers();

  const TestView = LottieFilePlayerView.extend({
    template: () => '<canvas></canvas>'
  });

  function playerView(View = TestView) {
    return new View({
      model: new LottieFile({
        state: 'uploaded',
        original_url: '/animation.lottie'
      })
    });
  }

  it('hides view while the animation is loading', () => {
    const view = playerView();

    render(view);

    expect(view.el).not.toBeVisible();
  });

  it('keeps view in the layout while the animation is loading', () => {
    const view = playerView();

    render(view);

    expect(window.getComputedStyle(view.el).display).not.toEqual('none');
  });

  it('displays view once the animation has loaded', () => {
    const view = playerView();

    render(view);
    players[0].emit('load');

    expect(view.el).toBeVisible();
  });

  it('resizes the player between sizing and displaying the view', () => {
    const steps = [];
    const view = playerView(TestView.extend({
      onAnimationLoad: () => steps.push('size')
    }));

    render(view);
    players[0].resize.mockImplementation(() => {
      steps.push('resize');
      expect(view.el).not.toBeVisible();
    });
    players[0].emit('load');

    expect(steps).toEqual(['size', 'resize']);
  });

  it('lets sub classes size the view before it is displayed', () => {
    const onAnimationLoad = jest.fn(function() {
      expect(this.el).not.toBeVisible();
    });
    const view = playerView(TestView.extend({onAnimationLoad}));

    render(view);
    players[0].emit('load');

    expect(onAnimationLoad).toHaveBeenCalled();
  });
});
