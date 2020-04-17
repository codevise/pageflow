import Backbone from 'backbone';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {SelectInputView} from 'pageflow/ui';

import {editor} from 'pageflow/editor';
import {features} from 'pageflow/frontend';

import {StorylineOutlineView} from './StorylineOutlineView';

import template from '../templates/storylinePicker.jst';

export const StorylinePickerView = Marionette.Layout.extend({
  template,
  className: 'storyline_picker',

  regions: {
    selectRegion: '.storyline_picker_select_region',
    mainRegion: '.storyline_picker_main_region'
  },

  ui: {
    storylines: '.storyline_picker_storylines'
  },

  events: {
    'click .add_storyline': function() {
      var storyline = this.options.entry.scaffoldStoryline({
        depth: 'page'
      }).storyline;

      this.listenToOnce(storyline, 'sync', function() {
        this.updateSelect();
        this.model.set('storyline_id', storyline.id);
      });

      return false;
    },

    'click .edit_storyline': function() {
      editor.navigate('storylines/' + this.model.get('storyline_id'), {trigger: true});
      return false;
    }
  },

  initialize: function() {
    this.model = new Backbone.Model({
      storyline_id: this.defaultStorylineId()
    });

    this.listenTo(this.options.entry.storylines, 'add sort remove', this.updateSelect);
    this.listenTo(this.model, 'change', this.load);
  },

  onRender: function() {
    this.$el.toggleClass('editable', !!this.options.editable);
    this.ui.storylines.toggle(!!features.isEnabled('storylines'));

    this.updateSelect();
    this.load();
  },

  updateSelect: function() {
    var storylines = this.options.entry.storylines;

    this.selectRegion.show(new SelectInputView({
      model: this.model,
      label: I18n.t('pageflow.editor.views.storylines_picker_view.label'),
      propertyName: 'storyline_id',
      values: storylines.pluck('id'),
      texts: storylines.map(function(storyline) {
        return this.indentation(storyline) + storyline.displayTitle();
      }, this),
      groups: storylines.reduce(function(result, storyline) {
        if (storyline.isMain() || storyline.parentPage()) {
          result.push(_.last(result));
        }
        else {
          result.push(I18n.t('pageflow.editor.views.storylines_picker_view.without_parent_page'));
        }
        return result;
      }, [])
    }));
  },

  load: function() {
    var storyline = this.options.entry.storylines.get(this.model.get('storyline_id'));

    this.saveRememberedStorylineId(storyline.id);

    this.mainRegion.show(new StorylineOutlineView({
      model: storyline,
      navigatable: this.options.navigatable,
      sortable: this.options.editable,
      chapterItemView: this.options.chapterItemView,
      pageItemView: this.options.pageItemView,
      pageItemViewOptions: this.options.pageItemViewOptions,
      displayInNavigationHint: this.options.displayInNavigationHint
    }));
  },

  defaultStorylineId: function() {
    var storyline =
      this.options.entry.storylines.get(this.options.storylineId) ||
      this.options.entry.storylines.get(this.rememberedStorylineId()) ||
      this.options.entry.storylines.first();

    return storyline.id;
  },

  rememberedStorylineId: function() {
    if (this.options.rememberLastSelection) {
      return StorylinePickerView._rememberedStorylineId;
    }
  },

  saveRememberedStorylineId: function(id) {
    if (this.options.rememberLastSelection) {
      StorylinePickerView._rememberedStorylineId = id;
    }
  },

  indentation: function(storyline) {
    return _(storyline.get('level') || 0).times(function() {
      return '\u00A0\u00A0\u00A0';
    }).join('');
  }
});
