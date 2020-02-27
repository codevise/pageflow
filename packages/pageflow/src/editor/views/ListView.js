import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {CollectionView, SortableCollectionView} from 'pageflow/ui';

import {ListItemView} from './ListItemView';

import template from '../templates/list.jst';

import blankSlateTemplate from '../templates/listBlankSlate.jst';

/**
 * A generic list view with items consisting of a thumbnail, text and
 * possibly some buttons or a navigation arrow.
 *
 * Models inside the collection must implement the following methods:
 *
 * @param {Backbone.Collection} options.collection
 *
 * @param {Object} options
 *
 * @param {string} options.label
 *   Text of the label to display above the list.
 *
 * @param {boolean} [options.highlight=false]
 *
 * @param {boolean} [options.sortable=false]
 *
 * @param {string|function} [options.itemDescription]
 *
 * @param {string|function} [options.itemTypeName]
 *
 * @param {string|function} [options.itemTypeDescription]
 *
 * @param {string|function} [options.itemIsInvalid]
 *
 * @param {function} [options.onEdit]
 *
 * @param {function} [options.onRemove]
 *
 * @class
 */
export const ListView = Marionette.ItemView.extend({
  template,
  className: 'list',

  ui: {
    label: '.list_label',
    items: '.list_items'
  },

  onRender: function() {
    var collectionViewConstructor = this.options.sortable ?
      SortableCollectionView :
      CollectionView;

    this.subview(new collectionViewConstructor({
      el: this.ui.items,
      collection: this.collection,

      itemViewConstructor: ListItemView,

      itemViewOptions: _.extend({
        description: this.options.itemDescription,
        typeName: this.options.itemTypeName,
        typeDescription: this.options.itemTypeDescription,
        isInvalid: this.options.itemIsInvalid
      }, _(this.options).pick('onEdit', 'onRemove', 'highlight')),

      blankSlateViewConstructor: Marionette.ItemView.extend({
        tagName: 'li',
        className: 'list_blank_slate',
        template: blankSlateTemplate
      })
    }));

    this.ui.label.text(this.options.label);

    this.$el.toggleClass('with_type_pictogram', !!this.options.itemTypeName);
  }
});
