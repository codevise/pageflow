import {editor, ImageModifierListInputView, InlineFileRightsMenuItem} from 'pageflow-scrolled/editor';
import {processImageModifiers} from 'pageflow-scrolled/frontend';
import {FileInputView} from 'pageflow/editor';
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

  // Browsers derive the content type of uploads from the file
  // extension. Since dotLottie is missing from their mappings, uploads
  // have an empty content type and matching by name is the only option.
  matchUpload: upload => /\.lottie$/i.test(upload.name)
});

const playbackModes = ['loop', 'playOnce', 'scroll'];

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

  configurationEditor({entry}) {
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

      this.view(SeparatorView);

      this.group('ContentElementPosition', {entry});

      this.view(SeparatorView);

      this.group('ContentElementCaption', {entry});
      this.group('ContentElementInlineFileRightsSettings');
    });
  }
});
