import React, {useCallback} from 'react';
import classNames from 'classnames';
import Backbone from 'backbone';

import styles from './TypographyVariantSelectInputView.module.css';

import {ListboxInputView} from './ListboxInputView';
import {watchCollections} from '../../../entryState';
import {SectionThumbnail} from 'pageflow-scrolled/frontend'

export const TypographyVariantSelectInputView = ListboxInputView.extend({
  renderItem(item) {
    return (
      <Preview entry={this.options.entry}
               contentElement={this.options.contentElement}
               item={item}
               getPreviewConfiguration={this.options.getPreviewConfiguration} />
    );
  }
});

function Preview({entry, contentElement, item, getPreviewConfiguration}) {
  const subscribe = useCallback(dispatch => {
    watchCollections(
      buildEntry(entry, contentElement, item, getPreviewConfiguration),
      {dispatch}
    );
  }, [entry, contentElement, item, getPreviewConfiguration]);

  const appearance = contentElement.section.configuration.get('appearance');

  return (
    <>
      <div className={classNames(styles.preview,
                                 styles[`${appearance}Appearance`])}
           aria-hidden="true">
        <SectionThumbnail scale={false}
                          seed={entry.scrolledSeed}
                          sectionPermaId={1}
                          subscribe={subscribe} />
      </div>
      {item.text}
    </>
  )
}

function buildEntry(entry, contentElement, item, getPreviewConfiguration) {
  const section = contentElement.section;

  const fakeContentElement = new Backbone.Model(
    contentElement.attributes,
  );
  fakeContentElement.configuration = new Backbone.Model(
    getPreviewConfiguration(
      contentElement.configuration.attributes,
      item.value
    )
  );

  const fakeSection = new Backbone.Model({
    ...section.attributes,
    permaId: 1
  });

  fakeSection.configuration = new Backbone.Model({
    ...section.configuration.attributes,
    transition: 'preview',
    fullHeight: false,
    layout: 'left',
    exposeMotifArea: false,
    backdrop: {
      ...section.configuration.attributes.backdrop,
      imageMotifArea: null,
      imageMobileMotifArea: null,
      videoMotifArea: null,
    }
  });

  return {
    id: entry.id,
    metadata: entry.metadata,
    widgets: entry.widgets,
    files: entry.files,

    chapters: new Backbone.Collection([section.chapter]),
    sections: new Backbone.Collection([fakeSection]),
    contentElements: new Backbone.Collection([
      fakeContentElement
    ])
  };
}
