/**
 * A generic list view with items consisting of a thumbnail, text and
 * possibly some buttons or a navigation arrow.
 *
 * Models inside the collection must implement the following methods:
 *
 * @param {Backbone.Collection} options.collection
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
 * @memberof module:pageflow/editor
 */
pageflow.ListView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/editor/templates/list',
  className: 'list',

  ui: {
    label: '.list_label',
    items: '.list_items'
  },

  onRender: function() {
    var collectionViewConstructor = this.options.sortable ?
      pageflow.SortableCollectionView :
      pageflow.CollectionView;

    this.subview(new collectionViewConstructor({
      el: this.ui.items,
      collection: this.collection,

      itemViewConstructor: pageflow.ListItemView,

      itemViewOptions: _.extend({
        description: this.options.itemDescription,
        typeName: this.options.itemTypeName,
        typeDescription: this.options.itemTypeDescription,
        isInvalid: this.options.itemIsInvalid
      }, _(this.options).pick('onEdit', 'onDelete', 'highlight')),

      blankSlateViewConstructor: Backbone.Marionette.ItemView.extend({
        tagName: 'li',
        className: 'list_blank_slate',
        template: 'pageflow/editor/templates/list_blank_slate'
      })
    }));

    this.ui.label.text(this.options.label);

    this.$el.toggleClass('with_type_pictogram', !!this.options.itemTypeName);
  }
});
