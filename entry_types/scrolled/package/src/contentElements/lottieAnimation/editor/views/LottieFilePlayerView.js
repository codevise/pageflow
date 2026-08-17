import Marionette from 'backbone.marionette';

import {DotLottie} from '../../dotLottie';

// Base class for views which play a lottie file. Sub classes render a
// canvas, return the options the player shall be created with from
// `playerOptions` and use `onAnimationLoad` for everything that
// requires the player to have read the file.
export const LottieFilePlayerView = Marionette.ItemView.extend({
  ui: {canvas: 'canvas'},

  onRender: function() {
    // Sub classes size themselves based on dimensions which only the
    // animation provides. The canvas stays invisible until the player
    // has read them. Taking it out of the layout instead would let the
    // surrounding box collapse and jump back open.
    this.$el.css('visibility', 'hidden');

    this.player = new DotLottie({
      canvas: this.ui.canvas[0],
      src: this.model.get('original_url'),
      renderConfig: {autoResize: true},
      ...this.playerOptions()
    });

    this.player.addEventListener('load', () => {
      this.onAnimationLoad();

      // The player has already drawn a frame into a canvas of the size
      // the view had before. It only notices the new size via a resize
      // observer, which fires too late to keep the frame from being
      // stretched into the new box.
      this.player.resize();

      this.$el.css('visibility', '');
    });
  },

  playerOptions: function() {
    return {};
  },

  onAnimationLoad: function() {},

  onClose: function() {
    this.player.destroy();
  }
});
