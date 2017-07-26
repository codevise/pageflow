import widgetsModule from '../widgets';
import {widgetAttributes} from '../widgets/selectors';

import createStore from 'createStore';

import Backbone from 'backbone';

import {expect} from 'support/chai';

describe('widgets', () => {
  it('exports redux module for widgets collection', () => {
    const widgetModel = new Backbone.Model({id: 'navigation', role: 'navigation', type_name: 'fancy'});
    widgetModel.configuration = new Backbone.Model({large: true});
    const widgets = new Backbone.Collection([widgetModel]);
    const store = createStore([widgetsModule], {widgets});

    const result = widgetAttributes({role: 'navigation'})(store.getState());

    expect(result).to.include({typeName: 'fancy', large: true});
  });
});
