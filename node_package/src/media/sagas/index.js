import togglePlaying from './togglePlaying';
import handlePageDidActivate from './handlePageDidActivate';
import disableScrollIndicatorDuringPlayback from './disableScrollIndicatorDuringPlayback';
import hasNotBeenPlayingForAMoment from './hasNotBeenPlayingForAMoment';
import idling from './idling';
import fadeOutWhenPageWillDeactivate from './fadeOutWhenPageWillDeactivate';
import goToNextPageOnEnd from './goToNextPageOnEnd';
import controlsHidden from './controlsHidden';

import {has} from 'utils';

export default function*(options = {}) {
  const sagas = [
    togglePlaying(),
  ];

  if (!options.playsInNativePlayer || !options.playsInNativePlayer()) {
    sagas.push([
      disableScrollIndicatorDuringPlayback(),
      goToNextPageOnEnd(),
      fadeOutWhenPageWillDeactivate(),
      hasNotBeenPlayingForAMoment()
    ]);
  }

  if (!has('mobile platform')) {
    sagas.push([
      handlePageDidActivate()
    ]);
  }

  if (options.hideControls) {
    sagas.push([
      idling(),
      controlsHidden()
    ]);
  }

  yield sagas;
}
