import {editor} from 'pageflow-scrolled/editor';
import {CheckBoxInputView} from 'pageflow/editor';

import {ItemsListView} from './ItemsListView';
import {ItemsCollection} from './models/ItemsCollection';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('imageGallery', {
  pictogram,
  category: 'media',
  featureName: 'image_gallery_content_element',
  supportedPositions: ['inline', 'sticky', 'left', 'right', 'wide', 'full'],

  configurationEditor({entry}) {
    this.tab('general', function() {
      this.view(ItemsListView, {
        collection: ItemsCollection.forContentElement(this.model.parent, entry)
      });
      this.input('enableFullscreenOnDesktop', CheckBoxInputView, {
        disabledBinding: 'position',
        disabledBindingValue: 'full',
        displayUncheckedIfDisabled: true
      });
      this.group('ContentElementPosition');
    });
  }
});
