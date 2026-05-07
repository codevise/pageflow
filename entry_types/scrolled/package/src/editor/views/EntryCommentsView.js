import React from 'react';
import I18n from 'i18n-js';

import {ThreadList, useCommentThreads} from 'pageflow-scrolled/review';

import {ReviewView} from './ReviewView';
import defaultPictogram from './images/defaultPictogram.svg';
import styles from './EntryCommentsView.module.css';

export const EntryCommentsView = ReviewView.extend({
  initialize() {
    this.listenTo(this.options.entry,
                  'change:highlightedThreadId',
                  () => this.rerender());
  },

  props() {
    const {entry, editor} = this.options;
    return {
      items: collectContentElements(entry),
      highlightedThreadId: entry.get('highlightedThreadId'),
      onThreadClick: thread => entry.trigger('selectCommentThread', thread.id),
      editor
    };
  },

  renderContent({items, highlightedThreadId, onThreadClick, editor}) {
    return (
      <div className={styles.list}>
        {items.map(({contentElement}) => (
          <ContentElementGroup key={contentElement.get('permaId')}
                               contentElement={contentElement}
                               highlightedThreadId={highlightedThreadId}
                               onThreadClick={onThreadClick}
                               editor={editor} />
        ))}
      </div>
    );
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

function ContentElementGroup({contentElement, highlightedThreadId, onThreadClick, editor}) {
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

  return (
    <div className={styles.group}>
      <ContentElementTypeSeparator label={label} pictogram={pictogram} />
      <ThreadList subjectType="ContentElement"
                  subjectId={permaId}
                  highlightedThreadId={highlightedThreadId}
                  onThreadClick={onThreadClick}
                  restrictInteractionsToHighlighted
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
