import {
  editor,
  ImageModifierListInputView,
  InlineFileRightsMenuItem,
  ScrollRangeSelectInputView
} from 'pageflow-scrolled/editor';
import {processImageModifiers} from 'pageflow-scrolled/frontend';
import {
  altConfigurationEditorInput,
  altMetaDataAttribute,
  FileInputView
} from 'pageflow/editor';
import {SelectInputView, SeparatorView} from 'pageflow/ui';

import {LottieFile} from './models/LottieFile';
import {LottieFilePositioningView} from './views/LottieFilePositioningView';
import {LottieFilePreviewView} from './views/LottieFilePreviewView';
import {LottieFileThumbnailView} from './views/LottieFileThumbnailView';

import pictogram from './pictogram.svg';

editor.fileTypes.register('lottie_files', {
  model: LottieFile,
  positioningView: LottieFilePositioningView,
  previewView: LottieFilePreviewView,
  thumbnailView: LottieFileThumbnailView,

  metaDataAttributes: [
    altMetaDataAttribute
  ],
  configurationEditorInputs: [
    altConfigurationEditorInput
  ],

  // Browsers derive the content type of uploads from the file
  // extension. Since dotLottie is missing from their mappings, uploads
  // have an empty content type and matching by name is the only option.
  matchUpload: upload => /\.lottie$/i.test(upload.name)
});

const playbackModes = ['loop', 'playOnce', 'scroll'];
const scrollRanges = ['cover', 'contain', 'inFocus', 'entry'];
const pinnedPositions = ['sticky', 'standAlone'];

const scrollRangeValuesKey =
  'pageflow_scrolled.editor.content_elements.lottieAnimation.attributes.scrollRange.values';
const pinnedScrollRangeKeys = ['cover', 'contain', 'inFocusWhenPinned', 'entry']
  .map(name => `${scrollRangeValuesKey}.${name}`);

editor.contentElementTypes.register('lottieAnimation', {
  pictogram,
  category: 'media',
  featureName: 'lottie_animation_content_element',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],
  supportedCaptions: true,
  supportedStyles: ['boxShadow', 'outline'],

  defaultConfig: {playbackMode: 'loop'},

  defaultsInputs() {
    this.input('playbackMode', SelectInputView, {values: playbackModes});
  },

  configurationEditor({entry, contentElement}) {
    this.tab('general', function() {
      this.input('id', FileInputView, {
        collection: 'lottie_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: imageModifiers => !!processImageModifiers(imageModifiers).aspectRatio,
        positioningBinding: 'imageModifiers',
        positioningOptions: () => {
          const {aspectRatio} = processImageModifiers(this.model.get('imageModifiers'));

          return {
            preview: aspectRatio && (1 / entry.getAspectRatio(aspectRatio))
          };
        },
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('imageModifiers', ImageModifierListInputView, {
        entry,
        visibleBinding: 'id',
        visible: () => this.model.getReference('id', 'lottie_files')
      });
      this.input('playbackMode', SelectInputView, {values: playbackModes});
      // Elements that stay in place while scrolling name the inFocus
      // range after that phase instead of after the center of the
      // viewport. Since the texts of a select cannot depend on other
      // attributes, there is one input per wording.
      this.input('scrollRange', ScrollRangeSelectInputView, {
        values: scrollRanges,
        ...scrollRangeIllustration(contentElement),
        visibleBinding: ['playbackMode', 'position'],
        visible: ([playbackMode]) =>
          playbackMode === 'scroll' && !staysInPlace(contentElement)
      });
      this.input('scrollRange', ScrollRangeSelectInputView, {
        values: scrollRanges,
        translationKeys: pinnedScrollRangeKeys,
        ...scrollRangeIllustration(contentElement),
        visibleBinding: ['playbackMode', 'position'],
        visible: ([playbackMode]) =>
          playbackMode === 'scroll' && staysInPlace(contentElement)
      });

      this.view(SeparatorView);

      this.group('ContentElementPosition', {entry});

      this.view(SeparatorView);

      this.group('ContentElementCaption', {entry});
      this.group('ContentElementInlineFileRightsSettings');
    });
  }
});

// Layouts that do not support sticky position render such elements
// inline, which does not keep them in place while scrolling.
function staysInPlace(contentElement) {
  return pinnedPositions.includes(contentElement.getResolvedPosition());
}

// Illustrate the ranges with the element as it looks in its section.
function scrollRangeIllustration(contentElement) {
  return {
    position: () => contentElement.getResolvedPosition(),
    sectionLayout: () => contentElement.section.configuration.get('layout')
  };
}
