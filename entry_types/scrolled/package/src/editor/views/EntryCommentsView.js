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
                  'change:selectedCommentsSubject',
                  this._onSelectedChange);
    this._observeSelectedElement();
  },

  props() {
    const {entry, editor} = this.options;
    return {
      items: collectItems(entry),
      selectedElement: this._selectedElement,
      selectedSection: this._selectedSection,
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

  renderContent({items, selectedElement, selectedSection, transientThreadIds, highlightedThreadId, onThreadClick, editor}) {
    return (
      <div className={styles.list}>
        {items.map(item => item.type === 'section' ?
          <SectionGroup key={`section-${item.section.get('permaId')}`}
                        section={item.section}
                        isSelected={item.section === selectedSection}
                        highlightedThreadId={highlightedThreadId}
                        onThreadClick={onThreadClick} /> :
          <ContentElementGroup key={`element-${item.contentElement.get('permaId')}`}
                               contentElement={item.contentElement}
                               isSelected={item.contentElement === selectedElement}
                               selectedHasTransientThreadIds={transientThreadIds !== undefined}
                               highlightedThreadId={highlightedThreadId}
                               onThreadClick={onThreadClick}
                               editor={editor} />
        )}
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

    const subject = this.options.entry.get('selectedCommentsSubject');
    this._selectedElement =
      subject?.subjectType === 'ContentElement' ?
        this.options.entry.contentElements.get(subject.id) :
        null;
    this._selectedSection =
      subject?.subjectType === 'Section' ?
        this.options.entry.sections.get(subject.id) :
        null;

    if (this._selectedElement) {
      this.listenTo(this._selectedElement.transientState,
                    'change:commentThreadIdsAtSelection',
                    () => this.rerender());
    }
  }
});

// Section comment groups precede the content element groups of the
// same section, so a reviewer sees feedback on the section as a whole
// above feedback on its individual elements.
function collectItems(entry) {
  const items = [];

  entry.chapters.each(chapter => {
    chapter.sections.each(section => {
      items.push({type: 'section', section});
      section.contentElements.each(contentElement => {
        items.push({type: 'contentElement', contentElement});
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
      <Separator label={label} pictogram={pictogram} />
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

function SectionGroup({section, isSelected, highlightedThreadId, onThreadClick}) {
  const permaId = section.get('permaId');
  const threads = useCommentThreads({
    subjectType: 'Section',
    subjectId: permaId
  });

  if (threads.length === 0) {
    return null;
  }

  // A section has no per-thread anchor in the preview, so selecting it
  // highlights all its threads at once, like a whole-element image badge.
  const groupHighlight = isSelected ? threads.map(t => t.id) : highlightedThreadId;

  return (
    <div className={styles.group}>
      <Separator label={I18n.t('pageflow_scrolled.editor.comments_view.section')} />
      <ThreadList subjectType="Section"
                  subjectId={permaId}
                  highlightedThreadId={groupHighlight}
                  onThreadClick={onThreadClick}
                  restrictInteractionsToHighlighted
                  showNewForm={false}
                  hideNewTopicButton />
    </div>
  );
}

function Separator({label, pictogram}) {
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
