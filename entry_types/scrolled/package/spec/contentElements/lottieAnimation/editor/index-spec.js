import {editor} from 'pageflow-scrolled/editor';
import {SelectInput, useFakeFeatures} from 'pageflow/testHelpers';

import {renderContentElementConfigurationEditor, useEditorGlobals} from 'support';

import 'contentElements/lottieAnimation/editor';
import {LottieFile} from 'contentElements/lottieAnimation/editor/models/LottieFile';

describe('lottieAnimation/editor', () => {
  const {createEntry} = useEditorGlobals({
    fileTypes: [{
      collectionName: 'lottie_files',
      typeName: 'PageflowScrolled::LottieFile'
    }]
  });

  describe('content element type', () => {
    function availableTypeNames() {
      return editor.contentElementTypes.toArray().map(type => type.typeName);
    }

    it('is not available by default', () => {
      expect(availableTypeNames()).not.toContain('lottieAnimation');
    });

    describe('with lottie_animation_content_element feature', () => {
      useFakeFeatures('editor', ['lottie_animation_content_element']);

      it('is available', () => {
        expect(availableTypeNames()).toContain('lottieAnimation');
      });

      it('loops by default', () => {
        const type = editor.contentElementTypes.findByTypeName('lottieAnimation');

        expect(type.defaultConfig).toEqual({playbackMode: 'loop'});
      });
    });
  });

  describe('configuration editor', () => {
    function renderConfigurationEditor({configuration, lottieFiles = []}) {
      const entry = createEntry({
        filesAttributes: {lottie_files: lottieFiles},
        contentElements: [{id: 1, typeName: 'lottieAnimation', configuration}]
      });

      return renderContentElementConfigurationEditor({
        entry,
        contentElement: entry.contentElements.get(1)
      });
    }

    it('displays select to choose playback mode', () => {
      const configurationEditor = renderConfigurationEditor({configuration: {}});

      const input = SelectInput.findByPropertyName('playbackMode', {
        inView: configurationEditor
      });

      expect(input.values()).toEqual(['loop', 'playOnce']);
    });
  });

  it('registers lottie file type for lottie_files collection', () => {
    expect(editor.fileTypes.findByCollectionName('lottie_files').model).toBe(LottieFile);
  });

  it('matches uploads of dotLottie files', () => {
    const fileType = editor.fileTypes.findByUpload({name: 'animation.lottie', type: ''});

    expect(fileType.collectionName).toEqual('lottie_files');
  });

  it('does not match uploads of other files', () => {
    expect(editor.fileTypes.findByUpload({
      name: 'animation.json', type: 'application/json'
    }).collectionName).toEqual('other_files');

    expect(editor.fileTypes.findByUpload({
      name: 'image.jpg', type: 'image/jpeg'
    }).collectionName).toEqual('image_files');
  });
});
