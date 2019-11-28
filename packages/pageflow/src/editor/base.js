import $ from 'jquery';

import {EditorApi} from './api';
import {app} from './app';

/**
 * The Pageflow editor.
 * @module pageflow/editor
 */

export const editor = new EditorApi();

export const startEditor = function(options) {
  $(function() {
    $.when(
      $.getJSON('/editor/entries/' + options.entryId + '/seed'),
      pageflow.browser.detectFeatures()
    )
      .done(function(result) {
        app.start(result[0]);
      })
      .fail(function() {
        alert('Error while starting editor.');
      });
  });
};
