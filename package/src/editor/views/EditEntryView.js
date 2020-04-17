import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {tooltipContainer} from 'pageflow/ui';

import {editor} from '../base';

import {failureIndicatingView} from './mixins/failureIndicatingView';

import {state} from '$state';

import template from '../templates/editEntry.jst';

export const EditEntryView = Marionette.Layout.extend({
  template,

  mixins: [failureIndicatingView, tooltipContainer],

  ui: {
    publishButton: 'a.publish',
    publicationStateButton: 'a.publication_state',
    menu: '.menu'
  },

  regions: {
    outlineRegion: '.edit_entry_outline_region'
  },

  events: {
    'click a.close': function() {
      $.when(state.editLock.release()).then(function() {
        window.location = '/admin/entries/' + state.entry.id;
      });
    },

    'click a.publish': function() {
      if (!this.ui.publishButton.hasClass('disabled')) {
        editor.navigate('/publish', {trigger: true});
      }

      return false;
    },

    'click .menu a': function(event) {
      editor.navigate($(event.target).data('path'), {trigger: true});
      return false;
    }
  },

  onRender: function() {
    this._addMenuItems();
    this._updatePublishButton();

    this.outlineRegion.show(new editor.entryType.outlineView({
      entry: state.entry,
      navigatable: true,
      editable: true,
      displayInNavigationHint: true,
      rememberLastSelection: true,
      storylineId: this.options.storylineId
    }));
  },

  _updatePublishButton: function() {
    var disabled = !this.model.get('publishable');

    this.ui.publishButton.toggleClass('disabled', disabled);

    if (disabled) {
      this.ui.publishButton.attr('data-tooltip',
                                 'pageflow.editor.views.edit_entry_view.cannot_publish');
    }
    else {
      this.ui.publishButton.removeAttr('data-tooltip');
    }
  },

  _addMenuItems: function() {
    var view = this;

    _.each(editor.mainMenuItems, function(options) {
      var item = $('<li><a href="#"></a></li>');
      var link = item.find('a');

      if (options.path) {
        link.data('path', options.path);
      }
      link.text(I18n.t(options.translationKey));

      if (options.click) {
        $(link).click(options.click);
      }


      view.ui.menu.append(item);
    });
  }
});
