import {LottieFilePlayerView} from './LottieFilePlayerView';

import styles from './LottieFilePositioningView.module.css';

export const LottieFilePositioningView = LottieFilePlayerView.extend({
  template: () => `<canvas class="${styles.canvas}"></canvas>`,

  className: function() {
    return styles[this.options.fit];
  },

  playerOptions: function() {
    return {autoplay: true, loop: true, layout: this.layout()};
  },

  setPosition: function(x, y) {
    this.align = [x / 100, y / 100];
    this.player.setLayout(this.layout());
  },

  // The player ignores layout changes as long as it is still reading
  // the file.
  onAnimationLoad: function() {
    this.player.setLayout(this.layout());
    this.applyDimensions();
  },

  layout: function() {
    return {fit: this.options.fit, align: this.align};
  },

  // Unlike images and videos, lottie files have no dimensions stored on
  // the server. The box can thus only be sized once the player has read
  // them from the file.
  applyDimensions: function() {
    var size = this.player.animationSize();

    if (size.width && size.height) {
      this.el.style.setProperty('--positioning-aspect-ratio',
                                `${size.width / size.height}`);
      this.el.style.setProperty('--positioning-width', `${size.width}px`);
    }
  }
});
