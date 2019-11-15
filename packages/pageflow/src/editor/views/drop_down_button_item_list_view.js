/** @api private */
pageflow.DropDownButtonItemListView = function(options) {
  return new pageflow.CollectionView({
    tagName: 'ul',
    className: 'drop_down_button_items',
    collection: options.items,
    itemViewConstructor: pageflow.DropDownButtonItemView
  });
};