import {ConfigurationEditorTabView} from 'pageflow/ui';
import {FileInputView} from 'pageflow/editor';

/**
 * Assert that all inputs rendered by a configuration editor are
 * described by a configuration schema. Registered via
 * {@link useConfigurationEditorMatchers}.
 *
 * The subject is a function that renders the configuration editor. Only
 * inputs of the rendered form are seen, since nested objects are
 * configured in separate views.
 *
 * @param {Object} schema - Configuration schema of the subject.
 *
 * @example
 * expect(() => renderContentElementConfigurationEditor({entry, contentElement}))
 *   .toRenderInputsMatching(require('./schema.json'));
 */
export function toRenderInputsMatching(render, schema) {
  const inputs = recordInputs(render);

  if (!inputs.length) {
    return {
      pass: false,
      message: () => 'expected configuration editor to render inputs, but it rendered none'
    };
  }

  const mismatches = inputs.flatMap(input => mismatchesOf(input, schema));

  return {
    pass: mismatches.length === 0,
    message: () =>
      mismatches.length
        ? `expected rendered inputs to match schema:\n  ${mismatches.join('\n  ')}`
        : 'expected rendered inputs not to match schema'
  };
}

function recordInputs(render) {
  const inputs = [];
  const input = ConfigurationEditorTabView.prototype.input;

  jest.spyOn(ConfigurationEditorTabView.prototype, 'input')
      .mockImplementation(function(propertyName, view, options = {}) {
        inputs.push({propertyName, view, options});

        return input.call(this, propertyName, view, options);
      });

  try {
    render();
  }
  finally {
    ConfigurationEditorTabView.prototype.input.mockRestore();
  }

  return inputs;
}

const checks = [fileCollectionMismatch];

function mismatchesOf({propertyName, view, options}, schema) {
  const property = (schema.properties || {})[propertyName];

  return checks.flatMap(check => check({propertyName, view, options, property}) || []);
}

function fileCollectionMismatch({propertyName, view, options, property}) {
  if (!isFileInput(view) || !options.collection) {
    return;
  }

  const declared = property && property['x-fileCollection'];

  if (declared !== options.collection) {
    return `${propertyName}: expected x-fileCollection ${JSON.stringify(options.collection)}, ` +
           `found ${JSON.stringify(declared)}`;
  }
}

function isFileInput(view) {
  return view === FileInputView || view.prototype instanceof FileInputView;
}
