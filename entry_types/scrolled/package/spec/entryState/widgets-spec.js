import {
  useWidget,
  watchCollections
} from 'entryState';

import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories} from 'pageflow/testHelpers';
import {renderHookInEntry, normalizeSeed} from 'support';

describe('useWidget', () => {
  it('reads data from watched collections', () => {
    const {result} = renderHookInEntry(() => useWidget({role: 'navigation'}), {
      setup: dispatch =>
        watchCollections(
          factories.entry(ScrolledEntry, {}, {
            widgetsAttributes: [{
              type_name: 'customNavigation',
              role: 'navigation',
              configuration: {text: 'some Text'}
            }],
            entryTypeSeed: normalizeSeed()
          }),
          {dispatch}
        )
    });
    const widget = result.current;

    expect(widget).toMatchObject({
      typeName: 'customNavigation',
      role: 'navigation',
      configuration: {text: 'some Text'}
    });
  });

  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useWidget({role: 'navigation'}),
      {
        seed: {
          widgets: [{
            typeName: 'customNavigation',
            role: 'navigation',
            configuration: {text: 'some Text'}
          }]
        }
      }
    );

    const widget = result.current;

    expect(widget).toMatchObject({
      typeName: 'customNavigation',
      role: 'navigation',
      configuration: {text: 'some Text'}
    });
  });

  it('ignores widgets with blank typeName', () => {
    const {result} = renderHookInEntry(
      () => useWidget({role: 'navigation'}),
      {
        seed: {
          widgets: [{
            typeName: null,
            role: 'navigation'
          }]
        }
      }
    );

    const widget = result.current;

    expect(widget).toBeUndefined();
  });
});
