import {
  renderContentElementConfigurationEditor,
  useConfigurationEditorMatchers
} from 'pageflow-scrolled/testHelpers';

import {useEditorGlobals} from 'support';

import 'contentElements/editor';

const fs = require('fs');
const path = require('path');

describe('configuration schemas', () => {
  useConfigurationEditorMatchers();

  const {createEntry} = useEditorGlobals();

  schemas().forEach(({typeName, schema}) => {
    it(`of ${typeName} match inputs of configuration editor`, () => {
      const entry = createEntry({
        sections: [{id: 1}],
        contentElements: [{id: 1, sectionId: 1, typeName}]
      });

      expect(() => renderContentElementConfigurationEditor({
        entry,
        contentElement: entry.contentElements.get(1)
      })).toRenderInputsMatching(schema);
    });
  });
});

function schemas() {
  const dir = path.join(__dirname, '..', '..', 'src', 'contentElements');

  return fs.readdirSync(dir)
           .map(name => path.join(dir, name, 'schema.json'))
           .filter(file => fs.existsSync(file))
           .map(file => JSON.parse(fs.readFileSync(file, 'utf8')))
           .map(schema => ({typeName: schema['x-subject'].typeName, schema}));
}
