import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import '@testing-library/jest-dom';

import {viewWithValidationErrorMessages} from 'pageflow/ui';

describe('viewWithValidationErrorMessages', () => {
  it('displays validation errors for property', () => {
    const model = new Backbone.Model({name: ''})
    const View = Marionette.ItemView.extend({
      template: () => '<input>',

      mixins: [viewWithValidationErrorMessages]
    });
    const view = new View({model, propertyName: 'name'})

    model.validationErrors = {name: ['Name cannot be blank']};
    view.render();

    expect(view.el).toHaveTextContent('Name cannot be blank');
  });

  it('preserves rendered content of view', () => {
    const model = new Backbone.Model({name: ''})
    const View = Marionette.ItemView.extend({
      template: () => 'Label: <input>',

      mixins: [viewWithValidationErrorMessages]
    });
    const view = new View({model, propertyName: 'name'})

    model.validationErrors = {name: ['Name cannot be blank']};
    view.render();

    expect(view.el).toHaveTextContent('Label');
  });

  it('adds "invalid" CSS class to element', () => {
    const model = new Backbone.Model({name: ''})
    const View = Marionette.ItemView.extend({
      template: () => '<input>',

      mixins: [viewWithValidationErrorMessages]
    });
    const view = new View({model, propertyName: 'name'})

    model.validationErrors = {name: ['Name cannot be blank']};
    view.render();

    expect(view.el).toHaveClass('invalid');
  });

  it('ignores validation errors for other property', () => {
    const model = new Backbone.Model({name: ''})
    const View = Marionette.ItemView.extend({
      template: () => '<input>',

      mixins: [viewWithValidationErrorMessages]
    });
    const view = new View({model, propertyName: 'other'})

    model.validationErrors = {name: ['Name cannot be blank']};
    view.render();

    expect(view.el).not.toHaveTextContent('Name cannot be blank');
  });

  it('updates validation error messages on invalid event', () => {
    const model = new Backbone.Model({name: ''})
    const View = Marionette.ItemView.extend({
      template: () => '<input>',

      mixins: [viewWithValidationErrorMessages]
    });
    const view = new View({model, propertyName: 'name'})

    view.render();
    model.validationErrors = {name: ['Name cannot be blank']};
    model.trigger('invalid');

    expect(view.el).toHaveTextContent('Name cannot be blank');
  });

  it('updates validation error messages on sync event', () => {
    const model = new Backbone.Model({name: ''})
    const View = Marionette.ItemView.extend({
      template: () => '<input>',

      mixins: [viewWithValidationErrorMessages]
    });
    const view = new View({model, propertyName: 'name'})

    model.validationErrors = {name: ['Name cannot be blank']};
    view.render();
    model.validationErrors = {};
    model.trigger('sync');

    expect(view.el).not.toHaveTextContent('Name cannot be blank');
  });

  it('hides validation errors once fixed', () => {
    const model = new Backbone.Model({name: ''})
    const View = Marionette.ItemView.extend({
      template: () => '<input>',

      mixins: [viewWithValidationErrorMessages]
    });
    const view = new View({model, propertyName: 'name'})

    model.validationErrors = {name: ['Name cannot be blank']};
    view.render();
    model.validationErrors = {};
    model.trigger('sync');

    expect(view.el).not.toHaveTextContent('Name cannot be blank');
    expect(view.el).not.toHaveClass('invalid');
  });
});
