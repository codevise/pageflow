import WidgetTypeRegistry from '../WidgetTypeRegistry';


describe('WidgetTypeRegistry', () => {
  describe('#findByName', () => {
    it('supports component and name property', () => {
      const registry = new WidgetTypeRegistry();
      const component = function() {};

      registry.register('some_widget', {
        component
      });
      const result = registry.findByName('some_widget');

      expect(result.component).toBe(component);
      expect(result.name).toBe('some_widget');
    });

    it('fails loudly if widget type is not found', () => {
      const registry = new WidgetTypeRegistry();

      expect(() =>
        registry.findByName('not_there')
      ).toThrowError(/Widget type with name "not_there" not found/);
    });
  });

  describe('#forEach', () => {
    it('iterates of registered widget types', () => {
      const registry = new WidgetTypeRegistry();
      const component1 = function() {};
      const component2 = function() {};
      const result = [];

      registry.register('widget1', {
        component: component1
      });
      registry.register('widget2', {
        component: component2
      });
      registry.forEach(widgetType =>
        result.push(widgetType)
      );

      expect(result).toEqual([
        {name: 'widget1', component: component1},
        {name: 'widget2', component: component2}
      ]);
    });
  });
});
