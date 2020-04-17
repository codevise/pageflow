import {ensureItemActionId} from './itemActionHelpers';
import {addItemScope, getItemScopeProperty} from './itemScopeHelpers';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React from 'react';

export default function(collectionName) {
  const itemScopeProperty = getItemScopeProperty(collectionName);

  return function connectInItemScope(mapStateToProps, mapDispatchToProps, mergeProps) {
    const connecter = connect(
      mapStateToProps ? (state, props) => {
        const result = mapStateToProps(
          addItemScope(state, collectionName, props[itemScopeProperty]),
          props
        );

        if (typeof result == 'function') {
          return function(state, props) {
            return result(
              addItemScope(state, collectionName, props[itemScopeProperty]),
              props
            );
          };
        }

        return result;
      } : null,
      mapDispatchToProps ? (dispatch, props) => {
        const wrappedDispatch = function(action) {
          ensureItemActionId(action, collectionName, props[itemScopeProperty]);
          return dispatch(action);
        };

        if (typeof mapDispatchToProps == 'function') {
          return mapDispatchToProps(wrappedDispatch, props);
        }
        else {
          return bindActionCreators(mapDispatchToProps, wrappedDispatch);
        }
      } : null,
      mergeProps
    );

    return function(Component) {
      const Connected = connecter(Component);

      class ConnectedInItemScope extends React.Component {
        render() {
          const props = {
            ...this.props,
            [itemScopeProperty]: this.context[itemScopeProperty]
          };

          return (<Connected {...props} />);
        }
      }

      ConnectedInItemScope.contextTypes = {
        [itemScopeProperty]: React.PropTypes.number
      };

      return ConnectedInItemScope;
    };
  };
}
