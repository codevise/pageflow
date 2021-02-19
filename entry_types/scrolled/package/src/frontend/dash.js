import {browser} from 'pageflow/frontend';

export async function loadDashUnlessHlsSupported() {
  if (!browser.has('hls support')) {
    await import('@videojs/http-streaming')
  }
}
