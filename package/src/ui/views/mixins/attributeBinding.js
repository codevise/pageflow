import {setup, resolve} from '../../utils/attributeBindingUtils';

export const attributeBinding = {
  setupBooleanAttributeBinding(optionName, updateMethod) {
    this.setupAttributeBinding(optionName, updateMethod, Boolean);
  },

  getBooleanAttributBoundOption(optionName) {
    return this.getAttributeBoundOption(optionName, Boolean);
  },

  setupAttributeBinding(optionName, updateMethod, normalize = value => value) {
    const binding = this.options[`${optionName}Binding`];
    const model = this.options[`${optionName}BindingModel`] || this.model;

    setup({
      binding,
      model,
      listener: this,
      normalize,
      option: this.options[optionName],
      bindingValue: this.options[`${optionName}BindingValue`],
      callback: value => updateMethod.call(this, value)
    });
  },

  getAttributeBoundOption(optionName, normalize = value => value) {
    const binding = this.options[`${optionName}Binding`];
    const model = this.options[`${optionName}BindingModel`] || this.model;

    return resolve({
      binding,
      model,
      normalize,
      option: this.options[optionName],
      bindingValue: this.options[`${optionName}BindingValue`]
    });
  }
};
