import Backbone from 'backbone';
import I18n from 'i18n-js';

import {editor, InlineFileRightsMenuItem, EditMotifAreaDialogView} from 'pageflow-scrolled/editor';
import {FileInputView, CheckBoxInputView} from 'pageflow/editor';
import {SelectInputView, SeparatorView, LabelOnlyView} from 'pageflow/ui';

import pictogram from './pictogram.svg';

const EditMotifAreaMenuItem = Backbone.Model.extend({
  defaults: {
    name: 'editMotifArea'
  },

  initialize(attributes, {inputModel, propertyName, file}) {
    this.set('label', I18n.t('pageflow_scrolled.editor.edit_motif_area_menu_item'));

    const update = () => {
      this.set('hidden', inputModel.get('position') !== 'backdrop');
    }

    this.listenTo(inputModel, `change:position`, update);
    update();

    this.selected = () => {
      EditMotifAreaDialogView.show({
        model: inputModel,
        propertyName,
        file
      });
    }
  }
})

editor.contentElementTypes.register('inlineVideo', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'sticky', 'standAlone', 'left', 'right', 'backdrop'],
  supportedWidthRange: ['xxs', 'full'],

  configurationEditor() {
    migrateLegacyAutoplay(this.model);

    this.tab('general', function() {
      this.input('id', FileInputView, {
        collection: 'video_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        defaultTextTrackFilePropertyName: 'defaultTextTrackFileId',
        dropDownMenuItems: [EditMotifAreaMenuItem, InlineFileRightsMenuItem]
      });
      this.input('posterId', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });

      this.input('portraitId', FileInputView, {
        collection: 'video_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        defaultTextTrackFilePropertyName: 'defaultTextTrackFileId',
        dropDownMenuItems: [EditMotifAreaMenuItem, InlineFileRightsMenuItem]
      });
      this.input('portraitPosterId', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        visibleBinding: 'portraitId',
        visible: () => this.model.getReference('portraitId', 'video_files'),
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });

      this.view(SeparatorView);

      this.input('playbackMode', SelectInputView, {
        values: ['manual', 'autoplay', 'loop']
      });

      this.input('hideControlBar', CheckBoxInputView, {
        disabledBinding: 'playbackMode',
        disabled: playbackMode => playbackMode === 'loop',
        displayCheckedIfDisabled: true
      });

      this.input('unmuteLabel', LabelOnlyView);
      this.input('unmute', CheckBoxInputView, {
        storeInverted: 'keepMuted'
      });
      this.input('rewindOnUnmute', CheckBoxInputView, {
        disabledBinding: ['playbackMode', 'keepMuted'],
        disabled: ([playbackMode, keepMuted]) =>
          playbackMode !=='autoplay' || keepMuted,
        displayUncheckedIfDisabled: true
      });

      this.view(SeparatorView);

      this.input('atmoDuringPlayback', SelectInputView, {
        values: ['play', 'mute', 'turnDown']
      });

      this.view(SeparatorView);

      this.group('ContentElementPosition');
    });
  }
});

function migrateLegacyAutoplay(model) {
  if (!model.has('playbackMode') && model.get('autoplay')) {
    model.set('playbackMode', 'autoplay', {trigger: false});
  }
}
