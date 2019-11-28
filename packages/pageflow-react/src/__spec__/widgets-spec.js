import widgetsModule from '../widgets';
import {widgetAttributes, editingWidget} from '../widgets/selectors';

import createStore from 'createStore';

import Backbone from 'backbone';


describe('widgets', () => {
  it('exports redux module for widgets collection', () => {
    const widgetModel = new Backbone.Model({id: 'navigation', role: 'navigation', type_name: 'fancy'});
    widgetModel.configuration = new Backbone.Model({large: true});
    const widgets = new Backbone.Collection([widgetModel]);
    const store = createStore([widgetsModule], {widgets});

    const result = widgetAttributes({role: 'navigation'})(store.getState());

    expect(result).toMatchObject({typeName: 'fancy', large: true});
  });

  describe('editingWidget selector', () => {
    it('returns false by default', () => {
      const widgetModel = new Backbone.Model({id: 'navigation', role: 'navigation', type_name: 'fancy'});
      widgetModel.configuration = new Backbone.Model({large: true});
      const widgets = new Backbone.Collection([widgetModel]);
      const store = createStore([widgetsModule], {widgets});

      const result = editingWidget({role: 'navigation'})(store.getState());

      expect(result).toBe(false);
    });

    it('returns true if editing attribute is set on widget', () => {
      const widgetModel = new Backbone.Model({id: 'navigation', role: 'navigation', type_name: 'fancy'});
      widgetModel.configuration = new Backbone.Model({large: true});
      const widgets = new Backbone.Collection([widgetModel]);
      const store = createStore([widgetsModule], {widgets});

      widgetModel.set('editing', true);
      const result = editingWidget({role: 'navigation'})(store.getState());

      expect(result).toBe(true);
    });
  });
});
