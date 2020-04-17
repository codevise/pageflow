import {
  pageAttribute,
  pageAttributes,
  pageIsActive,
  pageIsPrepared
} from 'pages/selectors';

import {
  currentParentPageAttributes,
  currentParentChapterAttributes
} from 'current/selectors';

import {
  t
} from 'i18n/selectors';

import {
  setting
} from 'settings/selectors';

import {
  file
} from 'files/selectors';

import {
  prop
} from 'utils/selectors';

import {
  widgetAttributes,
  editingWidget
} from 'widgets/selectors';

export {
  pageAttribute,
  pageAttributes,
  pageIsActive,
  pageIsPrepared,

  currentParentPageAttributes,
  currentParentChapterAttributes,

  t,

  setting,
  file,

  prop,

  widgetAttributes,
  editingWidget
};
