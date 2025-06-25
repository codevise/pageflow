import {editor} from 'pageflow-scrolled/editor';
import {contentElementWidths} from 'pageflow-scrolled/frontend';
import {CheckBoxInputView, SeparatorView} from 'pageflow/editor';

import {ItemsListView} from './ItemsListView';
import {ItemsCollection} from './models/ItemsCollection';

import {SidebarRouter} from './SidebarRouter';
import {SidebarController} from './SidebarController';

import pictogram from './pictogram.svg';

editor.registerSideBarRouting({
  router: SidebarRouter,
  controller: SidebarController
});

editor.contentElementTypes.register('imageGallery', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],

  configurationEditor({entry, contentElement}) {
    this.tab('general', function() {
      this.view(ItemsListView, {
        contentElement,
        collection: ItemsCollection.forContentElement(this.model.parent, entry),
      });
      this.input('displayPeeks', CheckBoxInputView, {
        storeInverted: 'hidePeeks'
      });
      this.input('displayPaginationIndicator', CheckBoxInputView);
      this.input('enableFullscreenOnDesktop', CheckBoxInputView, {
        disabledBinding: ['position', 'width'],
        disabled: () => contentElement.getWidth() === contentElementWidths.full,
        displayUncheckedIfDisabled: true
      });
      this.group('ContentElementPosition', {entry});
      this.view(SeparatorView);
      this.group('ContentElementCaption', {entry, disableWhenNoCaption: false});
      this.group('ContentElementInlineFileRightsSettings', {entry, disableWhenNoFileRights: false});
    });
  },

  defaultConfig: {displayPaginationIndicator: true}
});

editor.registerFileSelectionHandler('imageGalleryItem', function (options) {
  const contentElement = options.entry.contentElements.get(options.contentElementId);
  const items = ItemsCollection.forContentElement(contentElement, options.entry)

  this.call = function(file) {
    items.get(options.id).setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/scrolled/imageGalleries/' + contentElement.id + '/' + options.id;
  };
});
