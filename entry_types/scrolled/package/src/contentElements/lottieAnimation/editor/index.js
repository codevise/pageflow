import {editor, InlineFileRightsMenuItem} from 'pageflow-scrolled/editor';
import {FileInputView} from 'pageflow/editor';
import {SelectInputView, SeparatorView} from 'pageflow/ui';

import {LottieFile} from './models/LottieFile';
import {LottieFilePreviewView} from './views/LottieFilePreviewView';

import pictogram from './pictogram.svg';

editor.fileTypes.register('lottie_files', {
  model: LottieFile,
  previewView: LottieFilePreviewView,

  // Browsers derive the content type of uploads from the file
  // extension. Since dotLottie is missing from their mappings, uploads
  // have an empty content type and matching by name is the only option.
  matchUpload: upload => /\.lottie$/i.test(upload.name)
});

const playbackModes = ['loop', 'playOnce'];

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
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
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
