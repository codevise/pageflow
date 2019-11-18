import {Widget} from '$pageflow/editor';

import {WidgetItemView} from '$pageflow/editor';

import * as support from '$support';
import {SelectInput} from '$support/dominos/ui';

describe('WidgetItemView', () => {
  var f = support.factories;

  test('renders selects for widget type roles', () => {
    var widgetTypes = f.widgetTypes([
      {name: 'default_bar', role: 'navigation'},
      {name: 'fancy_bar', role: 'navigation'}
    ]);
    var widget = new Widget({
      id: 'navigation',
      type_name: 'default_bar'
    }, {widgetTypes: widgetTypes});
    var view = new WidgetItemView({
      model: widget,
      widgetTypes: widgetTypes
    });

    view.render();
    var select = SelectInput.find(view);

    expect(select.values()).toEqual(['default_bar', 'fancy_bar']);
  });

  test('includes blank item in select for optional role', () => {
    var widgetTypes = f.widgetTypes([
      {name: 'default_bar', role: 'navigation'},
      {name: 'fancy_bar', role: 'navigation'}
    ], function(w) {
      w.registerRole('navigation', {
        isOptional: true
      });
    });
    var widget = new Widget({
      id: 'navigation',
      type_name: 'default_bar'
    }, {widgetTypes: widgetTypes});
    var view = new WidgetItemView({
      model: widget,
      widgetTypes: widgetTypes
    });

    view.render();
    var select = SelectInput.find(view);

    expect(select.values()).toEqual(['', 'default_bar', 'fancy_bar']);
  });

  test(
    'includes blank item in select for non optional role if type name is blank',
    () => {
      var widgetTypes = f.widgetTypes([
        {name: 'default_bar', role: 'navigation'},
        {name: 'fancy_bar', role: 'navigation'}
      ]);
      var widget = new Widget({
        id: 'navigation',
        type_name: null
      }, {widgetTypes: widgetTypes});
      var view = new WidgetItemView({
        model: widget,
        widgetTypes: widgetTypes
      });

      view.render();
      var select = SelectInput.find(view);

      expect(select.values()).toEqual(['', 'default_bar', 'fancy_bar']);
    }
  );

  test('hides item if only one widget type is available', () => {
    var widgetTypes = f.widgetTypes([
      {name: 'default_bar', role: 'navigation'}
    ]);
    var widget = new Widget({
      id: 'navigation',
      type_name: 'default_bar'
    }, {widgetTypes: widgetTypes});
    var view = new WidgetItemView({
      model: widget,
      widgetTypes: widgetTypes
    });

    view.render();

    expect(view.$el).toHaveClass('is_hidden');
  });

  test(
    'displays item for optional role if only one widget type is available',
    () => {
      var widgetTypes = f.widgetTypes([
        {name: 'default_bar', role: 'navigation'}
      ], function(w) {
        w.registerRole('navigation', {
          isOptional: true
        });
      });
      var widget = new Widget({
        id: 'navigation',
        type_name: 'default_bar'
      }, {widgetTypes: widgetTypes});
      var view = new WidgetItemView({
        model: widget,
        widgetTypes: widgetTypes
      });

      view.render();

      expect(view.$el).not.toHaveClass('is_hidden');
    }
  );

  test(
    'displays item for non-optional role if only available widget type has settings',
    () => {
      var widgetTypes = f.widgetTypes([
        {name: 'fancy_bar', role: 'navigation'}
      ], function(w) {
        w.register('fancy_bar', {
          configurationEditorView: function() {}
        });
      });
      var widget = new Widget({
        id: 'navigation',
        type_name: 'fancy_bar'
      }, {widgetTypes: widgetTypes});
      var view = new WidgetItemView({
        model: widget,
        widgetTypes: widgetTypes
      });

      view.render();

      expect(view.$el).not.toHaveClass('is_hidden');
    }
  );

  test('displays settings button if widget type has settings', () => {
    var widgetTypes = f.widgetTypes([
      {name: 'default_bar', role: 'navigation'},
      {name: 'fancy_bar', role: 'navigation'}
    ], function(w) {
      w.register('fancy_bar', {
        configurationEditorView: function() {}
      });
    });
    var widget = new Widget({
      id: 'navigation',
      type_name: 'fancy_bar'
    }, {widgetTypes: widgetTypes});
    var view = new WidgetItemView({
      model: widget,
      widgetTypes: widgetTypes
    });

    view.render();

    expect(view.$el).toHaveClass('has_settings');
  });

  test(
    'does not display settings button if no widget type is selected',
    () => {
      var widgetTypes = f.widgetTypes([
        {name: 'default_bar', role: 'navigation'},
        {name: 'fancy_bar', role: 'navigation'}
      ]);
      var widget = new Widget({
        id: 'navigation',
        type_name: null
      }, {widgetTypes: widgetTypes});
      var view = new WidgetItemView({
        model: widget,
        widgetTypes: widgetTypes
      });

      view.render();

      expect(view.$el).not.toHaveClass('has_settings');
    }
  );
});
