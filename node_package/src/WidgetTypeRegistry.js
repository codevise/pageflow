export default function WidgetTypeRegistry() {
  var widgetTypes = [];

  this.register = function(name, {component}) {
    widgetTypes.push({
      name,
      component
    });
  };

  this.findByName = function(widgetTypeName) {
    const result = widgetTypes.find(({name}) =>
      name == widgetTypeName
    );

    if (!result) {
      throw `Widget type with name "${widgetTypeName}" not found.`;
    }

    return result;
  };

  this.forEach = function(...args) {
    widgetTypes.forEach(...args);
  };
}
