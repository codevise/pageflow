import $ from 'jquery';
import {browser} from 'pageflow/frontend';

import {EditorApi} from './api';
import {app} from './app';
import I18n from 'i18n-js';
import {patchSprocketsI18nForParentLocaleFallback}
  from './utils/patchSprocketsI18nForParentLocaleFallback';

export const editor = new EditorApi();

export const startEditor = function(options) {
  // In Webpack builds, I18n object from the i18n-js module is not
  // identical to window.I18n which is provided by the i18n-js gem via
  // the asset pipeline. Make translations provided via the asset
  // pipeline available in Webpack bundle.
  I18n.defaultLocale = window.I18n.defaultLocale;
  I18n.locale = window.I18n.locale;
  I18n.translations = window.I18n.translations;
  I18n.fallbacks = window.I18n.fallbacks;

  patchSprocketsI18nForParentLocaleFallback(window.I18n);

  $(function() {
    editor.ensureBrowserSupport(() => {
      Promise.all([
        $.getJSON('/editor/entries/' + options.entryId + '/seed'),
        browser.detectFeatures()
      ]).then(
        result => app.start(result[0]),
        () => alert('Error while starting editor.')
      );
    });
  });
};
