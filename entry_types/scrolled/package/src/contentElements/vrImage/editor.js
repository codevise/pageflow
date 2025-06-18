import {editor, InlineFileRightsMenuItem} from 'pageflow-scrolled/editor';
import {SelectInputView, FileInputView, EnumTableCellView, SliderInputView, SeparatorView} from 'pageflow/editor';

import pictogram from './pictogram.svg';

const aspectRatios = ['wide', 'narrow', 'square', 'portrait'];

editor.contentElementTypes.register('vrImage', {
  pictogram,
  category: 'interactive',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right', 'backdrop'],
  supportedWidthRange: ['xxs', 'full'],

  configurationEditor({entry}) {
    this.tab('general', function() {
      this.input('image', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        filter: 'with_projection',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('initialYaw', SliderInputView, {
        unit: '°',
        minValue: -180,
        maxValue: 180
      });
      this.input('initialPitch', SliderInputView, {
        unit: '°',
        minValue: -60,
        maxValue: 60
      });
      this.input('aspectRatio', SelectInputView, {
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'content_elements.vrImage.' +
                             'attributes.aspectRatio.blank',
        values: aspectRatios
      });
      this.input('portraitAspectRatio', SelectInputView, {
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'content_elements.vrImage.' +
                             'attributes.portraitAspectRatio.blank',
        values: aspectRatios
      });
      this.view(SeparatorView);
      this.group('ContentElementPosition', {entry});
      this.view(SeparatorView);
      this.group('ContentElementCaption', {entry});
      this.group('ContentElementInlineFileRightsSettings');
    });
  }
});

editor.fileTypes.modify('image_files', {
  configurationEditorInputs(model) {
    var values = ['equirectangular_mono', 'equirectangular_stereo'];

    return [
      {
        name: 'projection',
        inputView: SelectInputView,
        inputViewOptions: {
          includeBlank: true,
          values: values
        }
      }
    ];
  },

  confirmUploadTableColumns: [
    {
      name: 'projection',
      cellView: EnumTableCellView
    }
  ],

  filters: [
    {
      name: 'with_projection',
      matches: function(file) {
        return !!file.configuration.get('projection');
      }
    }
  ]
});
