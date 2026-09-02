import {toRenderInputsMatching} from 'testHelpers/matchers/toRenderInputsMatching';
import {renderContentElementConfigurationEditor} from 'pageflow-scrolled/testHelpers';

import {editor} from 'pageflow-scrolled/editor';
import {FileInputView} from 'pageflow/editor';

import {useEditorGlobals} from 'support';

describe('toRenderInputsMatching', () => {
  const {createEntry} = useEditorGlobals();

  it('checks inputs against properties of schema', () => {
    const render = renderer(function() {
      this.tab('general', function() {
        this.input('image', FileInputView, {collection: 'image_files'});
      });
    });

    const result = toRenderInputsMatching(render, {
      properties: {
        image: {'x-fileCollection': 'image_files'}
      }
    });

    expect(result.pass).toBe(true);
  });

  it('reports property whose collection does not match', () => {
    const render = renderer(function() {
      this.tab('general', function() {
        this.input('image', FileInputView, {collection: 'image_files'});
      });
    });

    const result = toRenderInputsMatching(render, {
      properties: {
        image: {'x-fileCollection': 'video_files'}
      }
    });

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('image');
    expect(result.message()).toContain('image_files');
  });

  it('checks inputs against properties of array items at path', () => {
    const render = renderer(function() {
      this.tab('area', function() {
        this.input('activeImage', FileInputView, {collection: 'image_files'});
      });
    });

    const result = toRenderInputsMatching(render, {
      properties: {
        areas: {
          items: {
            properties: {activeImage: {'x-fileCollection': 'image_files'}}
          }
        }
      }
    }, {path: ['areas', '*']});

    expect(result.pass).toBe(true);
  });

  it('checks inputs against properties of map values at path', () => {
    const render = renderer(function() {
      this.tab('area', function() {
        this.input('image', FileInputView, {collection: 'image_files'});
      });
    });

    const result = toRenderInputsMatching(render, {
      properties: {
        tooltips: {
          additionalProperties: {
            properties: {image: {'x-fileCollection': 'image_files'}}
          }
        }
      }
    }, {path: ['tooltips', '*']});

    expect(result.pass).toBe(true);
  });

  it('follows references into defs', () => {
    const render = renderer(function() {
      this.tab('area', function() {
        this.input('activeImage', FileInputView, {collection: 'image_files'});
      });
    });

    const result = toRenderInputsMatching(render, {
      properties: {
        areas: {items: {$ref: '#/$defs/area'}}
      },
      $defs: {
        area: {
          properties: {activeImage: {'x-fileCollection': 'image_files'}}
        }
      }
    }, {path: ['areas', '*']});

    expect(result.pass).toBe(true);
  });

  it('fails if schema describes nothing at path', () => {
    const render = renderer(function() {
      this.tab('area', function() {
        this.input('activeImage', FileInputView, {collection: 'image_files'});
      });
    });

    const result = toRenderInputsMatching(render, {properties: {}}, {path: ['areas', '*']});

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('areas/*');
  });

  function renderer(configurationEditor) {
    editor.contentElementTypes.register('probe', {configurationEditor});

    const entry = createEntry({
      sections: [{id: 1}],
      contentElements: [{id: 1, sectionId: 1, typeName: 'probe'}]
    });

    return () => renderContentElementConfigurationEditor({
      entry,
      contentElement: entry.contentElements.get(1)
    });
  }
});
