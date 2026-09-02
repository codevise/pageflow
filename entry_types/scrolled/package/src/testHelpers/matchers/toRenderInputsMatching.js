import {ConfigurationEditorTabView} from 'pageflow/ui';
import {FileInputView} from 'pageflow/editor';

/**
 * Assert that all inputs rendered by a configuration editor are
 * described by a configuration schema. Registered via
 * {@link useConfigurationEditorMatchers}.
 *
 * The subject is a function that renders the configuration editor. Only
 * inputs of the rendered form are seen. Views on nested routes render a
 * form of their own and are checked against the part of the schema that
 * describes the object they configure.
 *
 * @param {Object} schema - Configuration schema of the subject.
 * @param {Object} [options]
 * @param {Array<string>} [options.path] - Path of the configuration the
 *   rendered form writes, if it is not the root. `*` stands for array
 *   items and map values.
 *
 * @example
 * expect(() => renderContentElementConfigurationEditor({entry, contentElement}))
 *   .toRenderInputsMatching(require('./schema.json'));
 *
 * @example
 * expect(() => renderBackboneView(new SidebarEditAreaView(options)))
 *   .toRenderInputsMatching(require('../schema.json'), {path: ['areas', '*']});
 */
export function toRenderInputsMatching(render, schema, {path = []} = {}) {
  const subschema = subschemaAt(schema, path);

  if (!subschema) {
    return {
      pass: false,
      message: () => `expected schema to describe configuration at ${path.join('/')}`
    };
  }

  const inputs = recordInputs(render);

  if (!inputs.length) {
    return {
      pass: false,
      message: () => 'expected configuration editor to render inputs, but it rendered none'
    };
  }

  const mismatches = inputs.flatMap(input => mismatchesOf(input, subschema));

  return {
    pass: mismatches.length === 0,
    message: () =>
      mismatches.length
        ? `expected rendered inputs to match schema:\n  ${mismatches.join('\n  ')}`
        : 'expected rendered inputs not to match schema'
  };
}

function subschemaAt(schema, path) {
  return path.reduce(
    (current, segment) => dereference(child(current, segment), schema),
    dereference(schema, schema)
  );
}

function child(schema, segment) {
  if (!schema) {
    return undefined;
  }

  return segment === '*' ? schema.items || schema.additionalProperties
                         : schema.properties?.[segment];
}

function dereference(schema, document) {
  const seen = [];

  while (schema?.$ref && !seen.includes(schema.$ref)) {
    seen.push(schema.$ref);
    schema = localTarget(document, schema.$ref);
  }

  return schema?.$ref ? undefined : schema;
}

function localTarget(document, ref) {
  const [otherDocumentId, pointer] = ref.split('#');

  if (otherDocumentId) {
    return undefined;
  }

  return pointer.split('/').filter(Boolean).reduce((value, segment) => value?.[segment], document);
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
