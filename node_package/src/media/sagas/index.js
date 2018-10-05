import togglePlaying from './togglePlaying';
import muteBackgroundMediaOnPlayFailed from './muteBackgroundMediaOnPlayFailed';
import handlePageDidActivate from './handlePageDidActivate';
import disableScrollIndicatorDuringPlayback from './disableScrollIndicatorDuringPlayback';
import hasNotBeenPlayingForAMoment from './hasNotBeenPlayingForAMoment';
import idling from './idling';
import fadeOutWhenPageWillDeactivate from './fadeOutWhenPageWillDeactivate';
import goToNextPageOnEnd from './goToNextPageOnEnd';

import {has} from 'utils';

export default function*(options = {}) {
  const sagas = [
    togglePlaying(),
    muteBackgroundMediaOnPlayFailed(),
    disableScrollIndicatorDuringPlayback()
  ];

  if (!options.playsInNativePlayer || !options.playsInNativePlayer()) {
    sagas.push([
      goToNextPageOnEnd(),
      fadeOutWhenPageWillDeactivate(),
      hasNotBeenPlayingForAMoment()
    ]);
  }

  if (!has('mobile platform')) {
    sagas.push([
      handlePageDidActivate({
        ...options,
        canAutoplay: has('autoplay support'),
      })
    ]);
  }

  if (options.hideControls) {
    sagas.push([
      idling()
    ]);
  }

  yield sagas;
}
