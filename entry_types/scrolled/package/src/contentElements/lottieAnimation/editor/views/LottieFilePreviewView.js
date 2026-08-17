import {LottieFilePlayerView} from './LottieFilePlayerView';

import styles from './LottieFilePreviewView.module.css';

export const LottieFilePreviewView = LottieFilePlayerView.extend({
  template: () => `<canvas class="${styles.canvas}"></canvas>`,
  className: 'file_preview',

  playerOptions: function() {
    return {autoplay: true, loop: true};
  },

  // Unlike images and videos, lottie files have no dimensions stored on
  // the server. The box can thus only be sized once the player has read
  // them from the file.
  onAnimationLoad: function() {
    var size = this.player.animationSize();

    if (size.width && size.height) {
      this.ui.canvas[0].style.setProperty('--preview-aspect-ratio',
                                          `${size.width} / ${size.height}`);
      this.ui.canvas[0].style.setProperty('--preview-width', `${size.width}px`);
    }
  }
});
