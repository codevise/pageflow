import React from 'react';
import I18n from 'i18n-js';

import {ThreadList, useCommentThreads} from 'pageflow-scrolled/review';

import {ReviewView} from './ReviewView';
import defaultPictogram from './images/defaultPictogram.svg';
import styles from './EntryCommentsView.module.css';

export const EntryCommentsView = ReviewView.extend({
  initialize() {
    const {entry} = this.options;

    this.listenTo(entry,
                  'change:highlightedThreadId',
                  () => this.rerender());
    this.listenTo(entry,
                  'change:selectedContentElementCommentsId',
                  this._onSelectedChange);
    this._observeSelectedElement();
  },

  props() {
    const {entry, editor} = this.options;
    return {
      items: collectContentElements(entry),
      selectedElement: this._selectedElement,
      // Undefined for elements without a slate cursor (e.g. images);
      // an array (possibly empty) for textBlocks where Selection.js
      // has reported the cursor's overlapping threads.
      transientThreadIds:
        this._selectedElement?.transientState.get('commentThreadIdsAtSelection'),
      highlightedThreadId: entry.get('highlightedThreadId'),
      onThreadClick: thread => entry.trigger('selectCommentThread', thread.id),
      editor
    };
  },

  renderContent({items, selectedElement, transientThreadIds, highlightedThreadId, onThreadClick, editor}) {
    return (
      <div className={styles.list}>
        {items.map(({contentElement}) => (
          <ContentElementGroup key={contentElement.get('permaId')}
                               contentElement={contentElement}
                               isSelected={contentElement === selectedElement}
                               selectedHasTransientThreadIds={transientThreadIds !== undefined}
                               highlightedThreadId={highlightedThreadId}
                               onThreadClick={onThreadClick}
                               editor={editor} />
        ))}
      </div>
    );
  },

  _onSelectedChange() {
    this._observeSelectedElement();
    this.rerender();
  },

  _observeSelectedElement() {
    if (this._selectedElement) {
      this.stopListening(this._selectedElement.transientState);
    }

    const id = this.options.entry.get('selectedContentElementCommentsId');
    this._selectedElement = id ? this.options.entry.contentElements.get(id) : null;

    if (this._selectedElement) {
      this.listenTo(this._selectedElement.transientState,
                    'change:commentThreadIdsAtSelection',
                    () => this.rerender());
    }
  }
});

function collectContentElements(entry) {
  const items = [];

  entry.chapters.each(chapter => {
    chapter.sections.each(section => {
      section.contentElements.each(contentElement => {
        items.push({contentElement, section});
      });
    });
  });

  return items;
}

function ContentElementGroup({
  contentElement, isSelected, selectedHasTransientThreadIds,
  highlightedThreadId, onThreadClick, editor
}) {
  const permaId = contentElement.get('permaId');
  const threads = useCommentThreads({
    subjectType: 'ContentElement',
    subjectId: permaId
  });

  if (threads.length === 0) {
    return null;
  }

  const typeName = contentElement.get('typeName');
  const label = I18n.t(`pageflow_scrolled.editor.content_elements.${typeName}.name`);
  const pictogram = editor.contentElementTypes.findPictogram(typeName) || defaultPictogram;
  const compareRanges = editor.contentElementTypes.findCompareRanges(typeName);

  // Element-level badges (e.g. on images) have no per-thread anchor in
  // the iframe, so clicking such a badge highlights every thread of
  // the element rather than just one.
  const groupHighlight = isSelected && !selectedHasTransientThreadIds ?
                         threads.map(t => t.id) :
                         highlightedThreadId;

  return (
    <div className={styles.group}>
      <ContentElementTypeSeparator label={label} pictogram={pictogram} />
      <ThreadList subjectType="ContentElement"
                  subjectId={permaId}
                  compareRanges={compareRanges}
                  highlightedThreadId={groupHighlight}
                  onThreadClick={onThreadClick}
                  restrictInteractionsToHighlighted
                  showNewForm={false}
                  hideNewTopicButton />
    </div>
  );
}

function ContentElementTypeSeparator({label, pictogram}) {
  return (
    <div className={styles.separator}>
      <span className={styles.rule} />
      <span className={styles.typeName}>{label}</span>
      {pictogram &&
       <span className={styles.pictogram}
             style={{maskImage: `url('${escapeCssUrl(pictogram)}')`}} />}
      <span className={styles.rule} />
    </div>
  );
}

function escapeCssUrl(url) {
  return url.replace(/'/g, "\\'").replace(/\n/g, '');
}
