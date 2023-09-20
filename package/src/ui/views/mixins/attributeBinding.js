import _ from 'underscore';

export const attributeBinding = {
  setupBooleanAttributeBinding(optionName, updateMethod) {
    this.setupAttributeBinding(optionName, updateMethod, Boolean);
  },

  getBooleanAttributBoundOption(optionName) {
    return this.getAttributeBoundOption(optionName, Boolean);
  },

  setupAttributeBinding: function(optionName, updateMethod, normalize = value => value) {
    const binding = this.options[`${optionName}Binding`];
    const view = this;

    if (binding) {
      _.flatten([binding]).forEach(attribute => {
        this.listenTo(this.model, 'change:' + attribute, update);
      });
    }

    update();

    function update() {
      updateMethod.call(view, view.getAttributeBoundOption(optionName, normalize));
    }
  },

  getAttributeBoundOption(optionName, normalize = value => value) {
    const binding = this.options[`${optionName}Binding`];
    const bindingValueOptionName = `${optionName}BindingValue`;

    const value = Array.isArray(binding) ?
                  binding.map(attribute => this.model.get(attribute)) :
                  this.model.get(binding);

    if (bindingValueOptionName in this.options) {
      return value === this.options[bindingValueOptionName];
    }
    else if (typeof this.options[optionName] === 'function') {
      return normalize(this.options[optionName](value));
    }
    else if (optionName in this.options) {
      return normalize(this.options[optionName]);
    }
    else if (binding) {
      return normalize(value);
    }
  }
};
