// Fix Array#reverse in Safari 12
import 'array-reverse-polyfill';

import 'core-js/stable';

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

import iconMapping from 'components/icons/mapping';
import SvgIcon from 'components/icons/Container';

import classNames from 'classnames';
import {combineReducers} from 'redux';
import {connect} from 'react-redux';
import {combine} from 'utils';


import ServerSidePage from 'pages/ServerSidePage';
import ServerSideWidget from 'widgets/ServerSideWidget';
import ServerSidePageBackgroundAsset from 'pages/ServerSidePageBackgroundAsset';

import {register as registerBuiltInPageTypes} from 'builtInPageTypes';
import {registerWidgetTypes as registerBackgroundMediaWidgetTypes} from 'backgroundMedia';
import {registerWidgetTypes as registerCookieNoticeWidgetTypes} from 'cookieNotice';
import {registerWidgetTypes as registerLoadingSpinnerWidgetTypes} from 'loadingSpinner';

import pageflow from 'pageflow';
import boot from 'boot';

registerBuiltInPageTypes();
registerCookieNoticeWidgetTypes();
registerBackgroundMediaWidgetTypes();
registerLoadingSpinnerWidgetTypes();

if (pageflow.events) {
  pageflow.events.on('seed:loaded', () => boot(pageflow));
}

export default {
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

  ServerSidePage,
  ServerSideWidget,
  ServerSidePageBackgroundAsset
};
