import {WidgetsCollection} from 'editor/collections/WidgetsCollection';
import {factories} from '$support';

describe('WidgetsCollection', () => {
  it('supports gettting subset collection for insert point', () => {
    const widgetTypes = factories.widgetTypes([
      {role: 'navigation', name: 'some_navigation_bar', insertPoint: 'react'},
      {role: 'consent', name: 'some_consent_provider', insertPoint: 'bottom_of_entry'}
    ]);
    const widgets = new WidgetsCollection([
      {type_name: 'some_navigation_bar'},
      {type_name: 'some_consent_provider'},
    ], {widgetTypes});

    expect(
      widgets.withInsertPoint('react').pluck('type_name')
    ).toEqual(['some_navigation_bar']);
  });

  it('keeps insert point subset collection up to date when type name changes', () => {
    const widgetTypes = factories.widgetTypes([
      {role: 'consent', name: 'consent_bar', insertPoint: 'react'},
      {role: 'consent', name: 'some_consent_provider', insertPoint: 'bottom_of_entry'}
    ]);
    const widgets = new WidgetsCollection([
      {type_name: 'some_consent_provider'},
    ], {widgetTypes});
    widgets.subject = factories.entry();

    const subsetCollection = widgets.withInsertPoint('react');
    widgets.first().set('type_name', 'consent_bar');

    expect(subsetCollection.pluck('type_name')).toEqual(['consent_bar']);
  });
});
