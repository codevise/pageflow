import {addItemScope} from 'collections/itemScopeHelpers';
import runSaga from './runSaga';
import {createReducer} from 'createStore';

export default function(saga, {
  reduxModules = [],
  reduxModuleOptions = {},
  page = {attributes: {}},
  args = []
} = {}) {
  const reducer = createReducer(reduxModules, reduxModuleOptions);

  const stateFixture = {
    ...addItemScope({
      pages: {
        items: {
          5: page
        }
      }
    }, 'pages', 5)
  };

  return runSaga(saga, {
    args,
    reducer: function(state, action) {
      const reduxModulesState = reducer(state.reduxModuleState, action);

      return {
        reduxModuleState: reduxModulesState,
        ...reduxModulesState,
        ...stateFixture
      };
    }
  });
}
