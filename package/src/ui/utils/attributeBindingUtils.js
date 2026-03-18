import _ from 'underscore';

export function setup({
  binding, model, listener, callback, normalize = value => value,
  option, bindingValue
}) {
  if (binding) {
    _.flatten([binding]).forEach(attribute => {
      listener.listenTo(model, 'change:' + attribute, update);
    });
  }

  update();

  function update() {
    callback(resolve({
      binding, model, normalize, option, bindingValue
    }));
  }
}

export function resolve({
  binding, model, normalize = value => value,
  option, bindingValue
}) {
  const boundValue = Array.isArray(binding) ?
                     binding.map(attribute => model.get(attribute)) :
                     model.get(binding);

  if (bindingValue !== undefined) {
    return boundValue === bindingValue;
  }
  else if (typeof option === 'function') {
    return normalize(option(boundValue));
  }
  else if (option !== undefined) {
    return normalize(option);
  }
  else if (binding) {
    return normalize(boundValue);
  }
}
