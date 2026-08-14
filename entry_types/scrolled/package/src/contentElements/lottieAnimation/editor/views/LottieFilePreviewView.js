import Marionette from 'backbone.marionette';

import {cssModulesUtils} from 'pageflow/ui';

import {DotLottie} from '../../dotLottie';

import styles from './LottieFilePreviewView.module.css';

export const LottieFilePreviewView = Marionette.ItemView.extend({
  template: () => `<canvas class="${styles.canvas}"></canvas>`,
  className: 'file_preview',

  ui: cssModulesUtils.ui(styles, 'canvas'),

  onRender: function() {
    this.player = new DotLottie({
      canvas: this.ui.canvas[0],
      src: this.model.get('original_url'),
      autoplay: true,
      loop: true,
      renderConfig: {autoResize: true}
    });

    this.player.addEventListener('load', this.applyDimensions.bind(this));
  },

  // Unlike images and videos, lottie files have no dimensions stored on
  // the server. The box can thus only be sized once the player has read
  // them from the file.
  applyDimensions: function() {
    var size = this.player.animationSize();

    if (size.width && size.height) {
      this.ui.canvas[0].style.setProperty('--preview-aspect-ratio',
                                          `${size.width} / ${size.height}`);
      this.ui.canvas[0].style.setProperty('--preview-width', `${size.width}px`);
    }
  },

  onClose: function() {
    this.player.destroy();
  }
});
