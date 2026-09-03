import {editor} from 'pageflow-scrolled/editor';
import {FileInput, SelectInput, useFakeFeatures, useFakeTranslations} from 'pageflow/testHelpers';

import {
  illustratedOptionNames,
  renderContentElementConfigurationEditor,
  useEditorGlobals
} from 'support';

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
    function renderConfigurationEditor({configuration, lottieFiles = [], layout}) {
      const entry = createEntry({
        filesAttributes: {lottie_files: lottieFiles},
        sections: [{id: 1, configuration: {layout}}],
        contentElements: [{id: 1, sectionId: 1, typeName: 'lottieAnimation', configuration}]
      });

      return renderContentElementConfigurationEditor({
        entry,
        contentElement: entry.contentElements.get(1)
      });
    }

    useFakeTranslations({
      'pageflow_scrolled.editor.content_elements.lottieAnimation.attributes.scrollRange.values.cover':
        'While visible',
      'pageflow_scrolled.editor.content_elements.lottieAnimation.attributes.scrollRange.values.contain':
        'While completely visible',
      'pageflow_scrolled.editor.content_elements.lottieAnimation.attributes.scrollRange.values.entry':
        'While entering',
      'pageflow_scrolled.editor.content_elements.lottieAnimation.attributes.scrollRange.values.inFocus':
        'While crossing the viewport center',
      'pageflow_scrolled.editor.content_elements.lottieAnimation.attributes.scrollRange.values.inFocusWhenPinned':
        'While locked in place',
      'pageflow_scrolled.editor.content_elements.lottieAnimation.attributes.startAnimationTrigger.values.onActivate':
        'When scrolled to center of viewport',
      'pageflow_scrolled.editor.content_elements.lottieAnimation.attributes.startAnimationTrigger.values.onVisible':
        'When first scrolled into view'
    });

    it('displays select to choose playback mode', () => {
      const configurationEditor = renderConfigurationEditor({configuration: {}});

      const input = SelectInput.findByPropertyName('playbackMode', {
        inView: configurationEditor
      });

      expect(input.values()).toEqual(['loop', 'playOnce', 'scroll']);
    });

    it('displays select to choose when playback starts in playOnce playback mode', async () => {
      const configurationEditor = renderConfigurationEditor({
        configuration: {playbackMode: 'playOnce'}
      });

      expect(await illustratedOptionNames('startAnimationTrigger', {
        inView: configurationEditor
      })).toEqual([
        'When scrolled to center of viewport',
        'When first scrolled into view'
      ]);
    });

    it('does not display select to choose when playback starts in other playback modes', () => {
      const configurationEditor = renderConfigurationEditor({
        configuration: {playbackMode: 'scroll'}
      });

      expect(configurationEditor.visibleInputPropertyNames())
        .not.toContain('startAnimationTrigger');
    });

    it('displays select to choose scroll range in scroll playback mode', async () => {
      const configurationEditor = renderConfigurationEditor({
        configuration: {playbackMode: 'scroll'}
      });

      expect(await illustratedOptionNames('scrollRange', {inView: configurationEditor})).toEqual([
        'While visible',
        'While completely visible',
        'While crossing the viewport center',
        'While entering'
      ]);
    });

    it('names in focus range after pinned phase for sticky position', async () => {
      const configurationEditor = renderConfigurationEditor({
        configuration: {playbackMode: 'scroll', position: 'sticky'}
      });

      expect(await illustratedOptionNames('scrollRange', {inView: configurationEditor})).toEqual([
        'While visible',
        'While completely visible',
        'While locked in place',
        'While entering'
      ]);
    });

    it('names in focus range after pinned phase for standAlone position', async () => {
      const configurationEditor = renderConfigurationEditor({
        configuration: {playbackMode: 'scroll', position: 'standAlone'}
      });

      expect(await illustratedOptionNames('scrollRange', {inView: configurationEditor}))
        .toContain('While locked in place');
    });

    it('names in focus range after viewport center if layout inlines sticky', async () => {
      const configurationEditor = renderConfigurationEditor({
        layout: 'center',
        configuration: {playbackMode: 'scroll', position: 'sticky'}
      });

      expect(await illustratedOptionNames('scrollRange', {inView: configurationEditor}))
        .toContain('While crossing the viewport center');
    });

    it('does not display select to choose scroll range in other playback modes', () => {
      const configurationEditor = renderConfigurationEditor({
        configuration: {playbackMode: 'loop'}
      });

      expect(configurationEditor.visibleInputPropertyNames())
        .not.toContain('scrollRange');
    });

    it('displays image modifiers input if animation is present', () => {
      const configurationEditor = renderConfigurationEditor({
        lottieFiles: [{perma_id: 100}],
        configuration: {id: 100}
      });

      expect(configurationEditor.visibleInputPropertyNames())
        .toContain('imageModifiers');
    });

    it('does not display image modifiers input by default', () => {
      const configurationEditor = renderConfigurationEditor({configuration: {}});

      expect(configurationEditor.visibleInputPropertyNames())
        .not.toContain('imageModifiers');
    });

    it('offers to position animation inside crop', () => {
      const configurationEditor = renderConfigurationEditor({
        lottieFiles: [{perma_id: 100, state: 'uploaded'}],
        configuration: {id: 100, imageModifiers: [{name: 'crop', value: 'wide'}]}
      });

      expect(FileInput.findByPropertyName('id', {inView: configurationEditor}).menuItemNames())
        .toContain('edit_background_positioning');
    });

    it('does not offer to position animation that is not cropped', () => {
      const configurationEditor = renderConfigurationEditor({
        lottieFiles: [{perma_id: 100, state: 'uploaded'}],
        configuration: {id: 100}
      });

      expect(FileInput.findByPropertyName('id', {inView: configurationEditor}).menuItemNames())
        .not.toContain('edit_background_positioning');
    });
  });

  it('registers lottie file type for lottie_files collection', () => {
    expect(editor.fileTypes.findByCollectionName('lottie_files').model).toBe(LottieFile);
  });

  it('supports editing alt text of lottie files', () => {
    const fileType = editor.fileTypes.findByCollectionName('lottie_files');

    expect(fileType.configurationEditorInputs.map(input => input.name)).toContain('alt');
  });

  it('displays alt text in meta data of lottie files', () => {
    const fileType = editor.fileTypes.findByCollectionName('lottie_files');

    expect(fileType.metaDataAttributes.map(attribute => attribute.name)).toContain('alt');
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
