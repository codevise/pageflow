import Marionette from 'backbone.marionette';

import {cssModulesUtils} from 'pageflow/ui';

import {DotLottie} from '../../dotLottie';

import styles from './LottieFileThumbnailView.module.css';

export const LottieFileThumbnailView = Marionette.ItemView.extend({
  template: () => `<canvas class="${styles.canvas}"></canvas>`,
  className: styles.thumbnail,

  ui: cssModulesUtils.ui(styles, 'canvas'),

  onRender: function() {
    this.player = new DotLottie({
      canvas: this.ui.canvas[0],
      src: this.model.get('original_url'),
      autoplay: false,
      renderConfig: {autoResize: true}
    });

    this.player.addEventListener('load', this.seekToLastFrame.bind(this));
  },

  // Animations commonly build up their scene over time, which would
  // leave the thumbnail close to blank on the first frame the player
  // draws once it has loaded the file.
  seekToLastFrame: function() {
    this.player.setFrame(this.player.totalFrames - 1);
  },

  onClose: function() {
    this.player.destroy();
  }
});
