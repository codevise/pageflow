import $ from 'jquery';
import Backbone from 'backbone';
import I18n from 'i18n-js';
import _ from 'underscore';

import {app} from '../app';

import {HelpView} from './HelpView';
import {LockedView} from './LockedView';
import {UploaderView} from './UploaderView';

import {state} from '$state';

export const EditorView = Backbone.View.extend({
  scrollNavigationKeys: _.values({
    pageUp: 33,
    pageDown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40
  }),

  events: {
    'click a': function(event) {
      // prevent default for all links
      if (!$(event.currentTarget).attr('target') &&
          !$(event.currentTarget).attr('download') &&
          !$(event.currentTarget).attr('href')) {
        return false;
      }
    },

    'keydown sidebar': function(event) {
      this.preventScrollingPreviewWhileFocusInSidebar(event);
    }
  },

  initialize: function() {
    $(window).on('beforeunload', function(event) {
      if (state.entry.get('uploading_files_count') > 0)  {
        return I18n.t('pageflow.editor.views.editor_views.files_pending_warning');
      }
    });
  },

  render: function() {
    this.$el.layout({
      minSize: 300,
      togglerTip_closed: I18n.t('pageflow.editor.views.editor_views.show_editor'),
      togglerTip_open: I18n.t('pageflow.editor.views.editor_views.hide_editor'),
      resizerTip: I18n.t('pageflow.editor.views.editor_views.resize_editor'),
      enableCursorHotkey: false,
      fxName: 'none',
      maskIframesOnResize: true,

      onresize: function() {
        app.trigger('resize');
      }
    });

    new UploaderView().render();

    this.$el.append(new LockedView({
      model: state.editLock
    }).render().el);

    this.$el.append(new HelpView().render().el);
  },

  preventScrollingPreviewWhileFocusInSidebar: function(event) {
    if (this.scrollNavigationKeys.indexOf(event.which) >= 0) {
      event.stopPropagation();
    }
  }
});
