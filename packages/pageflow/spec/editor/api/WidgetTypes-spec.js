describe('WidgetTypes', function() {
  describe('#register/#findAllByRole', function() {
    it('allows getting a list of widget types with name and translation key', function() {
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

      expect(widgetType.name).to.eq('fancy_bar');
      expect(widgetType.translationKey).to.eq('pageflow.fancy_bar.widget_type_name');
    });

    it('returns empty array for unknown role', function() {
      var widgetTypes = new pageflow.WidgetTypes();

      widgetTypes.setup({});

      expect(widgetTypes.findAllByRole('not_there')).to.eql([]);
    });
  });

  describe('#register/#findByName', function() {
    it('allows getting a widget type by name', function() {
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

      expect(widgetType.name).to.eq('fancy_bar');
    });
  });

  describe('#register/#setup/#findByName', function() {
    it('allows supplying a configuration editor view for a widget type', function() {
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
    });
  });
});