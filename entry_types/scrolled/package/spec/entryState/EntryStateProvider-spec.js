import React from 'react';
import {renderHook, act} from '@testing-library/react-hooks';

import {EntryStateProvider} from 'entryState';
import {useEntryStateCollectionItems} from 'entryState/EntryStateProvider';

import {tick, useFakeParentWindow} from 'support';

describe('EntryStateProvider', () => {
  useFakeParentWindow();

  function renderPosts({collections, config = {}}) {
    return renderHook(
      () => useEntryStateCollectionItems('posts'),
      {
        wrapper: ({children}) => (
          <EntryStateProvider seed={{collections, config}}>
            {children}
          </EntryStateProvider>
        )
      }
    );
  }

  async function receive(data, {origin = window.location.origin} = {}) {
    await act(async () => {
      window.dispatchEvent(new MessageEvent('message', {data, origin}));
      await tick();
    });
  }

  it('reads collections from seed', () => {
    const {result} = renderPosts({collections: {posts: [{permaId: 1, title: 'News'}]}});

    expect(result.current.map(post => post.title)).toEqual(['News']);
  });

  describe('with collection resets accepted', () => {
    const config = {acceptCollectionResets: true};

    it('posts ready message to parent', () => {
      renderPosts({collections: {}, config});

      expect(window.parent.postMessage)
        .toHaveBeenCalledWith({type: 'READY'}, window.location.origin);
    });

    it('resets collections on message', async () => {
      const {result} = renderPosts({
        collections: {posts: [{permaId: 1, title: 'News'}]},
        config
      });

      await receive({
        type: 'RESET_COLLECTIONS',
        payload: {collections: {posts: [{permaId: 2, title: 'Report'}]}}
      });

      expect(result.current.map(post => post.title)).toEqual(['Report']);
    });

    it('fills collections seed did not contain', async () => {
      const {result} = renderPosts({config});

      await receive({
        type: 'RESET_COLLECTIONS',
        payload: {collections: {posts: [{permaId: 1, title: 'News'}]}}
      });

      expect(result.current.map(post => post.title)).toEqual(['News']);
    });

    it('ignores message from other origin', async () => {
      const {result} = renderPosts({
        collections: {posts: [{permaId: 1, title: 'News'}]},
        config
      });

      await receive({
        type: 'RESET_COLLECTIONS',
        payload: {collections: {posts: [{permaId: 2, title: 'Report'}]}}
      }, {origin: 'https://other.example.com'});

      expect(result.current.map(post => post.title)).toEqual(['News']);
    });

    it('ignores other messages', async () => {
      const {result} = renderPosts({
        collections: {posts: [{permaId: 1, title: 'News'}]},
        config
      });

      await receive({
        type: 'UPDATE_SEED',
        payload: {collections: {posts: [{permaId: 2, title: 'Report'}]}}
      });

      expect(result.current.map(post => post.title)).toEqual(['News']);
    });
  });

  describe('without collection resets accepted', () => {
    it('does not post ready message', () => {
      renderPosts({collections: {}});

      expect(window.parent.postMessage).not.toHaveBeenCalled();
    });

    it('ignores reset message', async () => {
      const {result} = renderPosts({collections: {posts: [{permaId: 1, title: 'News'}]}});

      await receive({
        type: 'RESET_COLLECTIONS',
        payload: {collections: {posts: [{permaId: 2, title: 'Report'}]}}
      });

      expect(result.current.map(post => post.title)).toEqual(['News']);
    });
  });
});
