/*global module*/

import * as actions from 'actions';
import * as components from 'components';
import * as selectors from 'selectors';

import {
  PageBackground as MediaPageBackground,
  reduxModule as mediaReduxModule,
  pageBackgroundReduxModule as mediaPageBackgroundReduxModule
} from 'media';

import {
  Page as PageWithInteractiveBackground,
  reduxModule as pageWithInteractiveBackgroundReduxModule
} from 'interactivePageBackground';

import {connectInPage} from 'pages';

import registerPageType from 'registerPageType';
import registerPageTypeWithDefaultBackground from 'registerPageTypeWithDefaultBackground';
import registerWidgetType from 'registerWidgetType';

import textEmbeds from 'textEmbeds';

import iconMapping from 'components/icons/mapping';
import SvgIcon from 'components/icons/Container';

import classNames from 'classnames';
import {combineReducers} from 'redux';
import {connect} from 'react-redux';
import {combine} from 'utils';


import ServerSidePage from 'pages/ServerSidePage';

import {register as registerBuiltInPageTypes} from 'builtInPageTypes';
import {registerWidgetTypes as registerCookieNoticeWidgetTypes} from 'cookieNotice';

import pageflow from 'pageflow';
import boot from 'boot';

registerBuiltInPageTypes();
registerCookieNoticeWidgetTypes();

if (pageflow.events) {
  pageflow.events.on('seed:loaded', () => boot(pageflow));
}

// `export default` does not play well with Webpack's `libraryTarget:
// 'assign'` at the moment. See
// https://github.com/webpack/webpack/issues/706
module.exports = {
  components: {
    MediaPageBackground,
    PageWithInteractiveBackground,
    ...components
  },

  actions,
  selectors,

  registerPageType,
  registerPageTypeWithDefaultBackground,
  registerWidgetType,
  registerTextEmbed: (...args) => textEmbeds.register(...args),

  mediaReduxModule,
  mediaPageBackgroundReduxModule,

  pageWithInteractiveBackgroundReduxModule,

  iconMapping,
  SvgIcon,

  classNames,
  connect,
  connectInPage,
  combineReducers,
  combine,

  ServerSidePage
};
