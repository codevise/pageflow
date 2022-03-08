import {browser} from 'pageflow/frontend';
import {getFileUrlTemplateHost} from '../entryState';

export async function loadDashUnlessHlsSupported(seed) {
  if (!hasHlsSupport({seed, agent: browser.agent})) {
    await import('@videojs/http-streaming')
  }
}

export function hasHlsSupport({agent, seed}) {
  return agent.matchesSafari() ||
         (agent.matchesMobilePlatform() &&
          (!agent.matchesAndroid() ||
           hlsHostSupportedByAndroid(seed)));
}

function hlsHostSupportedByAndroid(seed) {
  return getFileUrlTemplateHost(seed, 'videoFiles', 'hls-playlist').indexOf('_') < 0;
}
