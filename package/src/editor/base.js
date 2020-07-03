import $ from 'jquery';
import {browser} from 'pageflow/frontend';

import {EditorApi} from './api';
import {app} from './app';
import I18n from 'i18n-js';

export const editor = new EditorApi();

export const startEditor = function(options) {
  // In Webpack builds, I18n object from the i18n-js module is not
  // identical to window.I18n which is provided by the i18n-js gem via
  // the asset pipeline. Make translations provided via the asset
  // pipeline available in Webpack bundle.
  I18n.defaultLocale = window.I18n.defaultLocale;
  I18n.locale = window.I18n.locale;
  I18n.translations = window.I18n.translations;

  $(function() {
    editor.ensureBrowserSupport(() => { 
      $.when(
        $.getJSON('/editor/entries/' + options.entryId + '/seed'),
        browser.detectFeatures()
      )
        .done(function(result) {
          app.start(result[0]);
        })
        .fail(function() {
          alert('Error while starting editor.');
        });
    });
  });
  
};
