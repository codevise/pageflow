import I18n from 'i18n-js';

import {editor, InlineFileRightsMenuItem} from 'pageflow-scrolled/editor';
import {contentElementWidths} from 'pageflow-scrolled/frontend';
import {CheckBoxInputView, FileInputView, SelectInputView, SeparatorView} from 'pageflow/editor';

import {AreasListView} from './AreasListView';
import {AreasCollection} from './models/AreasCollection';

import {SidebarRouter} from './SidebarRouter';
import {SidebarController} from './SidebarController';

import pictogram from './pictogram.svg';

editor.registerSideBarRouting({
  router: SidebarRouter,
  controller: SidebarController
});

editor.contentElementTypes.register('hotspots', {
  pictogram,
  category: 'interactive',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right', 'backdrop'],
  supportedWidthRange: ['xxs', 'full'],
  supportedCaptions: true,
  supportedStyles: ['boxShadow', 'outline'],

  editorPath(contentElement) {
    const activeAreaId = contentElement.transientState.get('activeAreaId');

    if (activeAreaId) {
      return `/scrolled/hotspots/${contentElement.id}/${activeAreaId}`;
    }
  },

  configurationPlace(contentElement, path) {
    const [propertyName] = path;

    if (propertyName !== 'areas') {
      return elementConfigurationPlace(contentElement);
    }

    return areaConfigurationPlace(contentElement, path);
  },

  configurationEditor({entry, contentElement}) {
    this.tab('general', function() {
      this.input('image', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('portraitImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false
      });
      this.view(AreasListView, {
        configuration: this.model,
        contentElement,
        collection: AreasCollection.forContentElement(contentElement, entry)
      });
      this.input('invertTooltips', CheckBoxInputView);
      this.input('enablePanZoom', SelectInputView, {
        values: ['never', 'phonePlatform', 'always']
      });
      this.view(SeparatorView);
      this.input('enableFullscreen', CheckBoxInputView, {
        disabledBinding: ['position', 'width'],
        disabled: () => (
          contentElement.getWidth() === contentElementWidths.full ||
          contentElement.getPosition() === 'backdrop'
        ),
        displayUncheckedIfDisabled: true
      });
      this.group('ContentElementPosition', {entry});
      this.view(SeparatorView);
      this.group('LinkButtonVariant', {entry});
      this.group('ContentElementCaption', {entry});
      this.group('ContentElementInlineFileRightsSettings');
    });
  }
});

editor.registerFileSelectionHandler('hotspotsArea', function (options) {
  const contentElement = options.entry.contentElements.get(options.contentElementId);
  const areas = AreasCollection.forContentElement(contentElement, options.entry)

  this.call = function(file) {
    areas.get(options.id).setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/scrolled/hotspots/' + contentElement.id + '/' + options.id + '/' + options.tab;
  };
});

// The editor path of the element points at the active area, which
// would send the sidebar back to an area the property is not in.
function elementConfigurationPlace(contentElement) {
  return {
    select() {
      contentElement.postCommand({type: 'SET_ACTIVE_AREA', index: -1});
      contentElement.select();
    }
  };
}

function areaConfigurationPlace(contentElement, [, index, propertyName]) {
  const area = contentElement.configuration.get('areas')[index];
  const tab = propertyName.startsWith('portrait') ? 'portrait' : 'area';

  return {
    label: areaAttributeLabel(propertyName),

    select() {
      contentElement.postCommand({type: 'SET_ACTIVE_AREA', index: Number(index)});
      contentElement.select({navigate: false});

      editor.navigate(`/scrolled/hotspots/${contentElement.id}/${area.id}/${tab}`,
                      {trigger: true});
    }
  };
}

function areaAttributeLabel(propertyName) {
  return I18n.t(`${propertyName}.label`, {
    scope: 'pageflow_scrolled.editor.content_elements.hotspots.edit_area.attributes'
  });
}
