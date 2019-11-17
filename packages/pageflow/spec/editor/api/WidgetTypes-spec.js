describe('WidgetTypes', () => {
  describe('#register/#findAllByRole', () => {
    test(
      'allows getting a list of widget types with name and translation key',
      () => {
        var widgetTypes = new pageflow.WidgetTypes();

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

    test('returns empty array for unknown role', () => {
      var widgetTypes = new pageflow.WidgetTypes();

      widgetTypes.setup({});

      expect(widgetTypes.findAllByRole('not_there')).toEqual([]);
    });
  });

  describe('#register/#findByName', () => {
    test('allows getting a widget type by name', () => {
      var widgetTypes = new pageflow.WidgetTypes();

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
    test(
      'allows supplying a configuration editor view for a widget type',
      () => {
        var widgetTypes = new pageflow.WidgetTypes();
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

        expect(viewConstructor).to.have.been.calledWith(sinon.match({some: 'option'}));
      }
    );
  });
});