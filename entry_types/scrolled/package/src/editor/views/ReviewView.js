import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import Marionette from 'backbone.marionette';

import {
  ReviewStateProvider,
  ReviewMessageHandler,
  ScrollHighlightedThreadIntoViewProvider,
  LocatedCommentThreadsProvider
} from 'pageflow-scrolled/review';
import {
  EntryStateProvider,
  useEntryStateDispatch,
  watchCollections
} from 'pageflow-scrolled/entryState';

import styles from './ReviewView.module.css';

// Base Marionette view for comment-related sidebar panels. Provides the
// shared wiring: a container div, a ReviewMessageHandler bridging the
// session to the preview iframe, a ReviewStateProvider seeded from the
// current session state and its drafts, and an EntryStateProvider so the
// rendered tree can resolve entry structure (e.g. the section a comment
// subject lives in). Subclasses implement `renderContent(props)` to
// return the React subtree. Props are produced by `props()` (default:
// empty) and re-evaluated whenever the subclass calls `rerender()` —
// useful for re-rendering on backbone change events without requiring
// React subscription hooks inside the rendered tree.
export const ReviewView = Marionette.ItemView.extend({
  template: () => `<div class="${styles.container}"></div>`,

  props() {
    return {};
  },

  onShow() {
    const session = this.options.entry.reviewSession;

    this.reviewMessageHandler = ReviewMessageHandler.create({
      session,
      targetWindow: window
    });

    this.setDraft = draft => session.setDraft(draft);

    this.rerender();
  },

  onClose() {
    this.reviewMessageHandler.dispose();
    ReactDOM.unmountComponentAtNode(this._containerEl());
  },

  rerender() {
    const {entry} = this.options;
    ReactDOM.render(
      <ReviewStateProvider initialState={entry.reviewSession.state}
                           initialDrafts={entry.reviewSession.drafts}
                           setDraft={this.setDraft}>
        <EntryStateProvider seed={entry.scrolledSeed}>
          <WatchEntryCollections entry={entry} />
          <LocatedCommentThreadsProvider>
            <ScrollHighlightedThreadIntoViewProvider>
              {this.renderContent(this.props())}
            </ScrollHighlightedThreadIntoViewProvider>
          </LocatedCommentThreadsProvider>
        </EntryStateProvider>
      </ReviewStateProvider>,
      this._containerEl()
    );
  },

  _containerEl() {
    return this.$el.find(`.${styles.container}`)[0];
  }
});

function WatchEntryCollections({entry}) {
  const dispatch = useEntryStateDispatch();

  useEffect(() => watchCollections(entry, {dispatch}), [entry, dispatch]);

  return null;
}
