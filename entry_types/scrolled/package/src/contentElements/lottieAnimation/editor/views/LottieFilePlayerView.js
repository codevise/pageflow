import Marionette from 'backbone.marionette';

import {DotLottie} from '../../dotLottie';

// Base class for views which play a lottie file. Sub classes render a
// canvas, return the options the player shall be created with from
// `playerOptions` and use `onAnimationLoad` for everything that
// requires the player to have read the file.
export const LottieFilePlayerView = Marionette.ItemView.extend({
  ui: {canvas: 'canvas'},

  onRender: function() {
    this.player = new DotLottie({
      canvas: this.ui.canvas[0],
      src: this.model.get('original_url'),
      renderConfig: {autoResize: true},
      ...this.playerOptions()
    });

    this.player.addEventListener('load', this.onAnimationLoad.bind(this));
  },

  playerOptions: function() {
    return {};
  },

  onAnimationLoad: function() {},

  onClose: function() {
    this.player.destroy();
  }
});
