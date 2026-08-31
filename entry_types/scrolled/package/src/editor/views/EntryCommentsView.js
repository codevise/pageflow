import React from 'react';
import I18n from 'i18n-js';

import {
  ThreadList, matchesResolution, useLocatedCommentThreads
} from 'pageflow-scrolled/review';

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
    this.listenTo(entry.commentDisplayFilter,
                  'change:resolution',
                  () => this.rerender());
    this._observeSelectedElement();
  },

  props() {
    const {entry, editor} = this.options;
    return {
      selectedSubject: entry.get('selectedCommentsSubject') || null,
      // Undefined for elements without a slate cursor (e.g. images);
      // an array (possibly empty) for textBlocks where Selection.js
      // has reported the cursor's overlapping threads.
      transientThreadIds:
        this._selectedElement?.transientState.get('commentThreadIdsAtSelection'),
      highlightedThreadId: entry.get('highlightedThreadId'),
      resolution: entry.commentDisplayFilter.get('resolution'),
      onThreadClick: thread => entry.trigger('selectCommentThread', thread.id),
      editor
    };
  },

  renderContent(props) {
    return <CommentsList {...props} />;
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

function CommentsList({selectedSubject, transientThreadIds, highlightedThreadId, resolution, onThreadClick, editor}) {
  const {chapters} = useLocatedCommentThreads();

  // Threads the filter hides must not leave their chapter heading and
  // type separator behind. A thread the reviewer picked in the preview
  // stays listed even where the filter hides resolved ones, just as it
  // does within a group.
  const isListed = thread => matchesResolution(thread, resolution) ||
                             thread.id === highlightedThreadId;

  return (
    <div className={styles.list}>
      {chapters.map((chapter, index) =>
        <ChapterGroup key={`chapter-${chapter.permaId}`}
                      chapter={chapter}
                      number={chapter.isExcursion ? null : index + 1}
                      isListed={isListed}
                      selectedSubject={selectedSubject}
                      transientThreadIds={transientThreadIds}
                      highlightedThreadId={highlightedThreadId}
                      resolution={resolution}
                      onThreadClick={onThreadClick}
                      editor={editor} />
      )}
    </div>
  );
}

function ChapterGroup({chapter, number, isListed, ...groupProps}) {
  if (!chapter.sections.some(section => hasListedThreads(section, isListed))) {
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
          {section.threads.some(isListed) &&
           <SectionGroup section={section}
                         threads={section.threads.filter(isListed)}
                         {...groupProps} />}
          {section.contentElements.map(contentElement =>
            contentElement.threads.some(isListed) &&
            <ContentElementGroup key={`element-${contentElement.permaId}`}
                                 contentElement={contentElement}
                                 threads={contentElement.threads.filter(isListed)}
                                 {...groupProps} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function hasListedThreads(section, isListed) {
  return section.threads.some(isListed) ||
         section.contentElements.some(
           contentElement => contentElement.threads.some(isListed)
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
  contentElement, threads, selectedSubject, transientThreadIds,
  highlightedThreadId, resolution, onThreadClick, editor
}) {
  const {permaId, type} = contentElement;
  const label = I18n.t(`pageflow_scrolled.editor.content_elements.${type}.name`);
  const pictogram = editor.contentElementTypes.findPictogram(type) || defaultPictogram;

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
                  resolution={resolution}
                  highlightedThreadId={groupHighlight}
                  onThreadClick={onThreadClick}
                  restrictInteractionsToHighlighted
                  startCollapsed
                  markReadWhenHighlighted
                  showNewForm={false}
                  hideNewTopicButton />
    </div>
  );
}

function SectionGroup({section, threads, selectedSubject, highlightedThreadId, resolution, onThreadClick}) {
  const {permaId} = section;

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
                  resolution={resolution}
                  highlightedThreadId={groupHighlight}
                  onThreadClick={onThreadClick}
                  restrictInteractionsToHighlighted
                  startCollapsed
                  markReadWhenHighlighted
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
