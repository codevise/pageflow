import React from 'react';
import {BlueskyPlaceholder} from './BlueskyPlaceholder';
import {waitForIframeMessage} from '../../waitForIframeMessage';

export const blueskyProvider = {
  name: 'bluesky',
  Placeholder: BlueskyPlaceholder,
  embedScript: 'https://embed.bsky.app/static/embed.js',
  Seed: ({url}) => <div data-bluesky-uri={url} />,
  process() {
    if (!window.bluesky?.scan) {
      return Promise.reject(new Error('Bluesky embed script not loaded'));
    }

    window.bluesky.scan();
  },
  ready({element}) {
    return waitForIframeMessage(element);
  }
};
