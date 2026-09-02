import I18n from 'i18n-js';

import defaultPictogram from '../views/images/defaultPictogram.svg';

export function configurationPlace({chapter, subject, detail, pictogram, select}) {
  return {
    label: chapter ? labelInChapter(chapter, subject) : subject,
    detail,
    pictogram: pictogram || defaultPictogram,
    select
  };
}

function labelInChapter(chapter, subject) {
  return I18n.t('pageflow_scrolled.editor.configuration_places.label',
                {chapter: chapter.getDisplayName(), subject});
}
