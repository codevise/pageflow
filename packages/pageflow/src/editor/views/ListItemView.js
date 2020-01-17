import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {ModelThumbnailView} from './ModelThumbnailView';

import template from '../templates/listItem.jst';

export const ListItemView = Marionette.ItemView.extend({
  template,

  tagName: 'li',
  className: 'list_item',

  ui: {
    thumbnail: '.list_item_thumbnail',
    typePictogram: '.list_item_type_pictogram',
    title: '.list_item_title',
    description: '.list_item_description',
    editButton: '.list_item_edit_button',
    removeButton: '.list_item_remove_button'
  },

  events: {
    'click .list_item_edit_button': function() {
      this.options.onEdit(this.model);
      return false;
    },

    'click .list_item_remove_button': function() {
      this.options.onRemove(this.model);
      return false;
    },

    'mouseenter': function() {
      if (this.options.highlight) {
        this.model.highlight();
      }
    },

    'mouseleave': function() {
      if (this.options.highlight) {
        this.model.resetHighlight();
      }
    }
  },

  modelEvents: {
    'change': 'update'
  },

  onRender: function() {
    this.subview(new ModelThumbnailView({
      el: this.ui.thumbnail,
      model: this.model
    }));

    if (this.options.typeName) {
      this.$el.addClass(this.typeName());
    }

    this.ui.editButton.toggleClass('is_available', !!this.options.onEdit);
    this.ui.removeButton.toggleClass('is_available', !!this.options.onRemove);

    this.update();
  },

  update: function() {
    this.ui.typePictogram.attr('title', this.typeDescription());

    this.ui.title.text(this.model.title() || I18n.t('pageflow.editor.views.page_link_item_view.unnamed'));

    this.ui.description.text(this.description());
    this.ui.description.toggle(!!this.description());

    this.$el.toggleClass('is_invalid', !!this.getOptionResult('isInvalid'));
  },

  onClose: function() {
    if (this.options.highlight) {
      this.model.resetHighlight();
    }
  },

  description: function() {
    return this.getOptionResult('description');
  },

  typeName: function() {
    return this.getOptionResult('typeName');
  },

  typeDescription: function() {
    return this.getOptionResult('typeDescription');
  },

  getOptionResult: function(name) {
    return typeof this.options[name]  === 'function' ?
      this.options[name](this.model) :
      this.options[name];
  }
});
