import I18n from 'i18n-js';

import {editor} from 'pageflow-scrolled/editor';
import {CheckBoxInputView, SliderInputView, SeparatorView} from 'pageflow/ui';

import {ItemsListView} from './ItemsListView';
import {ItemsCollection} from './models/ItemsCollection';

import {SidebarRouter} from './SidebarRouter';
import {SidebarController} from './SidebarController';

import pictogram from './pictogram.svg';

editor.registerSideBarRouting({
  router: SidebarRouter,
  controller: SidebarController
});

editor.contentElementTypes.register('logoList', {
  pictogram,
  category: 'tilesAndLinks',
  featureName: 'logo_list_content_element',
  supportedPositions: ['inline'],
  supportedWidthRange: ['md', 'full'],

  editorPath(contentElement) {
    const selectedItemId = contentElement.transientState.get('selectedItemId');

    if (selectedItemId) {
      return `/scrolled/logoLists/${contentElement.id}/${selectedItemId}`;
    }
  },

  configurationPlace(contentElement, path) {
    const [propertyName, index, itemProperty] = path;

    if (propertyName !== 'items') {
      return;
    }

    const item = contentElement.configuration.get('items')[index];

    return {
      label: attributeLabel(itemProperty),

      select() {
        contentElement.postCommand({type: 'SET_SELECTED_ITEM', index: Number(index)});
        contentElement.select({navigate: false});

        editor.navigate(`/scrolled/logoLists/${contentElement.id}/${item.id}`,
                        {trigger: true});
      }
    };
  },

  configurationEditor({entry, contentElement}) {
    const logoHeightScale = entry.getScale('logoListLogoHeight', {
      defaultValuePropertyName: 'logoListLogoHeight'
    });
    const marqueeSpeedScale = entry.getScale('logoListMarqueeSpeed', {
      defaultValuePropertyName: 'logoListMarqueeSpeed'
    });

    this.tab('general', function() {
      this.view(ItemsListView, {
        contentElement,
        collection: ItemsCollection.forContentElement(this.model.parent, entry)
      });

      this.input('staggered', CheckBoxInputView);
      this.input('marquee', CheckBoxInputView);

      if (marqueeSpeedScale.values.length) {
        this.input('marqueeSpeed', SliderInputView, {
          values: marqueeSpeedScale.values,
          texts: marqueeSpeedScale.texts,
          defaultValue: marqueeSpeedScale.defaultValue,
          saveOnSlide: true,
          visibleBinding: 'marquee',
          onInteractionStart: () =>
            contentElement.postCommand({type: 'START_MARQUEE_PREVIEW'}),
          onInteractionEnd: () =>
            contentElement.postCommand({type: 'STOP_MARQUEE_PREVIEW'})
        });
      }

      if (logoHeightScale.values.length) {
        this.input('logoHeight', SliderInputView, {
          values: logoHeightScale.values,
          texts: logoHeightScale.texts,
          defaultValue: logoHeightScale.defaultValue,
          saveOnSlide: true
        });
      }

      this.view(SeparatorView);
      this.group('ContentElementPosition', {entry});
    });
  }
});

editor.registerFileSelectionHandler('logoListItem', function(options) {
  const contentElement = options.entry.contentElements.get(options.contentElementId);
  const items = ItemsCollection.forContentElement(contentElement, options.entry);

  this.call = function(file) {
    items.get(options.id).setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/scrolled/logoLists/' + contentElement.id + '/' + options.id;
  };
});

function attributeLabel(propertyName) {
  return I18n.t(`${propertyName}.label`, {
    scope: 'pageflow_scrolled.editor.content_elements.logoList.edit_item.attributes'
  });
}
