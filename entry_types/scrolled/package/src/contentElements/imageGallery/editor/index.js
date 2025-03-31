import {editor} from 'pageflow-scrolled/editor';
import {contentElementWidths} from 'pageflow-scrolled/frontend';
import {CheckBoxInputView, SeparatorView} from 'pageflow/editor';

import {ItemsListView} from './ItemsListView';
import {ItemsCollection} from './models/ItemsCollection';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('imageGallery', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],

  configurationEditor({entry, contentElement}) {
    this.tab('general', function() {
      this.view(ItemsListView, {
        collection: ItemsCollection.forContentElement(this.model.parent, entry)
      });
      this.input('displayPeeks', CheckBoxInputView, {
        storeInverted: 'hidePeeks'
      });
      this.input('enableFullscreenOnDesktop', CheckBoxInputView, {
        disabledBinding: ['position', 'width'],
        disabled: () => contentElement.getWidth() === contentElementWidths.full,
        displayUncheckedIfDisabled: true
      });
      this.group('ContentElementPosition');
      this.view(SeparatorView);
      this.group('ContentElementCaption', {entry, disableWhenNoCaption: false});
      this.group('ContentElementInlineFileRightsSettings', {entry, disableWhenNoFileRights: false});
    });
  }
});
