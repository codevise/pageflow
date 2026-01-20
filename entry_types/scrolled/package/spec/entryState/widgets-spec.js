import {
  useWidget,
  useActiveWidgets,
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
            widgetTypes: factories.widgetTypes([{
              role: 'navigation', name: 'customNavigation', insertPoint: 'react'
            }]),
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

  it('filters out non react widgets in editor', () => {
    const {result} = renderHookInEntry(() => useWidget({role: 'consent'}), {
      setup: dispatch =>
        watchCollections(
          factories.entry(ScrolledEntry, {}, {
            widgetTypes: factories.widgetTypes([{
              role: 'consent', name: 'some_consent_provider', insertPoint: 'bottom_of_entry'
            }]),
            widgetsAttributes: [{
              type_name: 'some_consent_provider',
              role: 'consent'
            }],
            entryTypeSeed: normalizeSeed()
          }),
          {dispatch}
        )
    });
    const widget = result.current;

    expect(widget).toBeUndefined();
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

describe('useActiveWidgets', () => {
  it('returns widgets with typeName from seed', () => {
    const {result} = renderHookInEntry(
      () => useActiveWidgets(),
      {
        seed: {
          widgets: [
            {typeName: 'navWidget', role: 'header', configuration: {fixed: true}},
            {typeName: 'footerWidget', role: 'footer', configuration: {}}
          ]
        }
      }
    );

    expect(result.current).toMatchObject([
      {typeName: 'navWidget', role: 'header', configuration: {fixed: true}},
      {typeName: 'footerWidget', role: 'footer', configuration: {}}
    ]);
  });

  it('filters out widgets with blank typeName', () => {
    const {result} = renderHookInEntry(
      () => useActiveWidgets(),
      {
        seed: {
          widgets: [
            {typeName: 'navWidget', role: 'header', configuration: {}},
            {typeName: null, role: 'consent', configuration: {}}
          ]
        }
      }
    );

    expect(result.current).toMatchObject([
      {typeName: 'navWidget', role: 'header', configuration: {}}
    ]);
  });
});
