import {useWidget, updateWidgetConfiguration} from 'entryState';

import {renderHookInEntry} from 'support';

describe('updateWidgetConfiguration', () => {
  it('updates the configuration of a widget', () => {
    const newConfiguration = {text: 'update'};
    const {result} = renderHookInEntry(() => useWidget({role: 'navigation'}), {
      seed: {
        widgets: [{
          typeName: 'customNavigation',
          role: 'navigation',
          configuration: {text: 'some Text'}
        }]
      },
      setup: dispatch => {
        updateWidgetConfiguration({
          role: 'navigation',
          dispatch,
          configuration: newConfiguration
        });
      }
    });
    const widget = result.current;

    expect(widget.configuration.text).toEqual('update');
  });
});
