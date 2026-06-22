import React, {useEffect} from 'react';
import I18n from 'i18n-js';

import {EntryStateProvider, useEntryStateDispatch, watchCollections} from 'pageflow-scrolled/entryState';
import {ThreadList, useLocatedCommentThreads} from 'pageflow-scrolled/review';

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
      entry,
      selectedSubject: entry.get('selectedCommentsSubject') || null,
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

  renderContent({entry, ...props}) {
    return (
      <EntryStateProvider seed={entry.scrolledSeed}>
        <WatchEntryCollections entry={entry} />
        <CommentsList {...props} />
      </EntryStateProvider>
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

    if (this._selectedElement) {
      this.listenTo(this._selectedElement.transientState,
                    'change:commentThreadIdsAtSelection',
                    () => this.rerender());
    }
  }
});

function WatchEntryCollections({entry}) {
  const dispatch = useEntryStateDispatch();

  useEffect(() => watchCollections(entry, {dispatch}), [entry, dispatch]);

  return null;
}

function CommentsList({selectedSubject, transientThreadIds, highlightedThreadId, onThreadClick, editor}) {
  const {chapters} = useLocatedCommentThreads();

  return (
    <div className={styles.list}>
      {chapters.map((chapter, index) =>
        <ChapterGroup key={`chapter-${chapter.permaId}`}
                      chapter={chapter}
                      number={chapter.isExcursion ? null : index + 1}
                      selectedSubject={selectedSubject}
                      transientThreadIds={transientThreadIds}
                      highlightedThreadId={highlightedThreadId}
                      onThreadClick={onThreadClick}
                      editor={editor} />
      )}
    </div>
  );
}

function ChapterGroup({chapter, number, ...groupProps}) {
  if (chapter.threadCount === 0) {
    return null;
  }

  return (
    <div className={styles.chapter}>
      <ChapterHeading number={number} title={chapter.title} />
      {/* Section comment groups precede the content element groups of
          the same section, so a reviewer sees feedback on the section
          as a whole above feedback on its individual elements. */}
      {chapter.sections.map(section => (
        <React.Fragment key={`section-${section.permaId}`}>
          {section.threads.length > 0 &&
           <SectionGroup section={section} {...groupProps} />}
          {section.contentElements.map(contentElement =>
            contentElement.threads.length > 0 &&
            <ContentElementGroup key={`element-${contentElement.permaId}`}
                                 contentElement={contentElement}
                                 {...groupProps} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function ChapterHeading({number, title}) {
  return (
    <div className={styles.chapterHeading}>
      <span className={styles.rule} />
      <span className={styles.chapterNumber}>
        {number != null ?
         `${I18n.t('pageflow_scrolled.editor.chapter_item.chapter')} ${number}` :
         I18n.t('pageflow_scrolled.editor.chapter_item.excursion')}
      </span>
      <span className={styles.chapterTitle}>
        {title}
      </span>
      <span className={styles.rule} />
    </div>
  );
}

function ContentElementGroup({
  contentElement, selectedSubject, transientThreadIds,
  highlightedThreadId, onThreadClick, editor
}) {
  const {permaId, type, threads} = contentElement;
  const label = I18n.t(`pageflow_scrolled.editor.content_elements.${type}.name`);
  const pictogram = editor.contentElementTypes.findPictogram(type) || defaultPictogram;
  const compareRanges = editor.contentElementTypes.findCompareRanges(type);

  const isSelected = selectedSubject?.subjectType === 'ContentElement' &&
                     selectedSubject.id === contentElement.id;

  // Element-level badges (e.g. on images) have no per-thread anchor in
  // the iframe, so clicking such a badge highlights every thread of
  // the element rather than just one.
  const groupHighlight = isSelected && transientThreadIds === undefined ?
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

function SectionGroup({section, selectedSubject, highlightedThreadId, onThreadClick}) {
  const {permaId, threads} = section;

  const isSelected = selectedSubject?.subjectType === 'Section' &&
                     selectedSubject.id === section.id;

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
