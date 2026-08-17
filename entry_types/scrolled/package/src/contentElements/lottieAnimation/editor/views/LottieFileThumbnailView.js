import {LottieFilePlayerView} from './LottieFilePlayerView';

import styles from './LottieFileThumbnailView.module.css';

export const LottieFileThumbnailView = LottieFilePlayerView.extend({
  template: () => `<canvas class="${styles.canvas}"></canvas>`,
  className: styles.thumbnail,

  playerOptions: function() {
    return {autoplay: false, layout: {fit: 'cover'}};
  },

  // Animations commonly build up their scene over time, which would
  // leave the thumbnail close to blank on the first frame the player
  // draws once it has loaded the file.
  onAnimationLoad: function() {
    this.player.setFrame(this.player.totalFrames - 1);
  }
});
