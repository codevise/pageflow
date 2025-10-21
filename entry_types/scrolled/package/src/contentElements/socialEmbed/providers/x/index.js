import React from 'react';
import {XPlaceholder} from './XPlaceholder';

export const xProvider = {
  name: 'x',
  Placeholder: XPlaceholder,
  embedScript: 'https://platform.twitter.com/widgets.js',
  Seed: () => <div />,
  process({element, url, configuration}) {
    const postId = url ? url.split('/')[5] : undefined;

    if (!postId || !window.twttr?.widgets) {
      return Promise.reject(new Error('Invalid post URL or X widgets not loaded'));
    }

    const options = {
      cards: configuration.hideMedia ? 'hidden' : '',
      conversation: configuration.hideConversation ? 'none' : '',
    };

    return window.twttr.widgets.createTweet(postId, element, options);
  }
};
