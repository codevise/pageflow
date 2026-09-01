import I18n from 'i18n-js';

import {collectionsSnapshot} from 'pageflow-scrolled/entryState';

import {editor} from '../../api';

import {collectEntryFileReferences} from '../../../shared/collectEntryFileReferences';

import defaultPictogram from '../../views/images/defaultPictogram.svg';
import sectionPictogram from '../../views/images/sectionPictogram.svg';

export function fileReferences(entry) {
  const {config} = entry.scrolledSeed;

  const references = collectEntryFileReferences({
    collections: collectionsSnapshot(entry),
    locations: config.fileReferenceLocations,
    fileModelTypes: config.fileModelTypes
  });

  return {
    placesFor(file) {
      return references.of(camelize(file.fileType().collectionName), file.get('perma_id'))
                       .filter(({active}) => active)
                       .map(({subject}) => place(entry, subject));
    }
  };
}

function place(entry, subject) {
  if (subject.model === 'section') {
    const section = entry.sections.findWhere({permaId: subject.permaId});

    return {
      label: label(section.chapter, sectionName(section)),
      pictogram: sectionPictogram,
      select: () => entry.trigger('selectSectionSettings', section)
    };
  }

  const contentElement = entry.contentElements.findWhere({permaId: subject.permaId});

  return {
    label: label(contentElement.section.chapter, contentElementName(contentElement)),
    pictogram: contentElementPictogram(contentElement),
    select: () => entry.trigger('selectContentElement', contentElement)
  };
}

function label(chapter, subject) {
  return I18n.t('pageflow_scrolled.editor.configuration_places.label',
                {chapter: chapter.getDisplayName(), subject});
}

function sectionName(section) {
  return I18n.t('pageflow_scrolled.editor.configuration_places.section',
                {number: section.chapter.sections.indexOf(section) + 1});
}

function contentElementPictogram(contentElement) {
  return editor.contentElementTypes.findPictogram(contentElement.get('typeName')) ||
         defaultPictogram;
}

function contentElementName(contentElement) {
  return I18n.t(
    `pageflow_scrolled.editor.content_elements.${contentElement.get('typeName')}.name`
  );
}

// File collections are named in snake case in the editor and in camel
// case in entry state.
function camelize(collectionName) {
  return collectionName.replace(/_(.)/g, (match, character) => character.toUpperCase());
}
