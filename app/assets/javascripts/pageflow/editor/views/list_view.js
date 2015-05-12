/**
 * A generic list view with items consisting of a thumbnail, text and
 * possibly some buttons or a navigation arrow.
 *
 * Models inside the collection must implement the following methods:
 *
 * - `title` - A text for the list item.
 * - `thumbnailFile` - The file to use as thumbnail for the list item.
 *
 * @option collection [Backbone.Collection]
 * @option highlight [Boolean]
 * @option sortable [Boolean]
 * @option label [String]
 * @option itemDescription [String|Function]
 * @option itemTypeName [String|Function]
 * @option itemTypeDescription [String|Function]
 * @option itemIsInvalid [String|Function]
 * @option onEdit [Function]
 * @option onRemove [Function]
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