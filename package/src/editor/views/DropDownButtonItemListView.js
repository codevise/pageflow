import {CollectionView} from 'pageflow/ui';

import {DropDownButtonItemView} from './DropDownButtonItemView';

export const DropDownButtonItemListView = function(options) {
  return new CollectionView({
    tagName: 'ul',
    className: 'drop_down_button_items',
    collection: options.items,
    itemViewConstructor: DropDownButtonItemView,
    itemViewOptions: {listView: DropDownButtonItemListView}
  });
};
