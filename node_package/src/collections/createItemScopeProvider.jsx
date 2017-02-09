import {getItemScopeProperty} from './itemScopeHelpers';

import React from 'react';

export default function(collectionName) {
  class ItemScopeProvider extends React.Component {
    getChildContext() {
      return {
        [getItemScopeProperty(collectionName)]: this.props.itemId,
      };
    }

    render() {
      return this.props.children;
    }
  }

  ItemScopeProvider.childContextTypes = {
    [getItemScopeProperty(collectionName)]: React.PropTypes.number
  };

  return ItemScopeProvider;
}
