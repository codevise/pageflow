import {editor, InlineFileRightsMenuItem, ImageModifierListInputView} from 'pageflow-scrolled/editor';
import {contentElementWidths} from 'pageflow-scrolled/frontend';
import {FileInputView} from 'pageflow/editor';
import {SeparatorView, CheckBoxInputView} from 'pageflow/ui';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('inlineImage', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],

  configurationEditor({entry, contentElement}) {
    this.tab('general', function() {
      this.input('id', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: imageModifiers => imageModifiers?.length,
        positioningBinding: 'imageModifiers',
        positioningOptions: () => {
          const aspectRatio = entry.getAspectRatio(this.model.get('imageModifiers')?.[0]?.value);
          return {
            preview: aspectRatio && (1 / aspectRatio)
          };
        },
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('imageModifiers', ImageModifierListInputView, {
        entry,
        visibleBinding: 'id',
        visible: () => this.model.getReference('id', 'image_files')
      });
      this.input('portraitId', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: imageModifiers => imageModifiers?.length,
        positioningBinding: 'portraitImageModifiers',
        positioningOptions: () => {
          const aspectRatio =  entry.getAspectRatio(this.model.get('portraitImageModifiers')?.[0]?.value);
          return {
            preview: aspectRatio && (1 / aspectRatio)
          }
        }
      });
      this.input('portraitImageModifiers', ImageModifierListInputView, {
        entry,
        visibleBinding: 'portraitId',
        visible: () => this.model.getReference('portraitId', 'image_files')
      });
      this.input('enableFullscreen', CheckBoxInputView, {
        disabledBinding: ['position', 'width'],
        disabled: () => contentElement.getWidth() === contentElementWidths.full,
        displayUncheckedIfDisabled: true
      });
      this.group('ContentElementPosition', {entry});

      this.view(SeparatorView);

      this.group('ContentElementCaption', {entry});
      this.group('ContentElementInlineFileRightsSettings');
    });
  }
});
