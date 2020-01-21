import {WidgetTypes} from 'pageflow/editor/api/WidgetTypes';

import sinon from 'sinon';

describe('WidgetTypes', () => {
  describe('#register/#findAllByRole', () => {
    it(
      'allows getting a list of widget types with name and translation key',
      () => {
        var widgetTypes = new WidgetTypes();

        widgetTypes.setup({
          navigation: [
            {
              name: 'fancy_bar',
              translationKey: 'pageflow.fancy_bar.widget_type_name'
            }
          ]
        });

        var widgetType = widgetTypes.findAllByRole('navigation')[0];

        expect(widgetType.name).toBe('fancy_bar');
        expect(widgetType.translationKey).toBe('pageflow.fancy_bar.widget_type_name');
      }
    );

    it('returns empty array for unknown role', () => {
      var widgetTypes = new WidgetTypes();

      widgetTypes.setup({});

      expect(widgetTypes.findAllByRole('not_there')).toEqual([]);
    });
  });

  describe('#register/#findByName', () => {
    it('allows getting a widget type by name', () => {
      var widgetTypes = new WidgetTypes();

      widgetTypes.setup({
        navigation: [
          {
            name: 'fancy_bar',
            translationKey: 'pageflow.fancy_bar.widget_type_name'
          }
        ]
      });

      var widgetType = widgetTypes.findByName('fancy_bar');

      expect(widgetType.name).toBe('fancy_bar');
    });
  });

  describe('#register/#setup/#findByName', () => {
    it(
      'allows supplying a configuration editor view for a widget type',
      () => {
        var widgetTypes = new WidgetTypes();
        var viewConstructor = sinon.spy();

        widgetTypes.register('fancy_bar', {
          configurationEditorView: viewConstructor
        });
        widgetTypes.setup({
          navigation: [
            {
              name: 'fancy_bar',
              translationKey: 'pageflow.fancy_bar.widget_type_name'
            }
          ]
        });

        var widgetType = widgetTypes.findByName('fancy_bar');
        widgetType.createConfigurationEditorView({some: 'option'});

        expect(viewConstructor).toHaveBeenCalledWith(sinon.match({some: 'option'}));
      }
    );
  });
});
