import {editor} from 'pageflow-scrolled/editor';
import {features} from 'pageflow/frontend';
import {SelectInputView, SliderInputView, SeparatorView} from 'pageflow/ui';

import {SidebarRouter} from './SidebarRouter';
import {SidebarController} from './SidebarController';
import {SidebarListView} from './SidebarListView';
import {ExternalLinkCollection} from './models/ExternalLinkCollection';
import {maxLinkWidth} from '../linkWidths';

import pictogram from './pictogram.svg';

//register sidebar router to handle multiple sidebar views of this content element
//router defines the URL hash path mapping and controller provides functions for the paths
editor.registerSideBarRouting({
  router: SidebarRouter,
  controller: SidebarController
});

// register external link list content element configuration editor for sidebar
editor.contentElementTypes.register('externalLinkList', {
  pictogram,
  category: 'tilesAndLinks',
  supportedPositions: ['inline', 'standAlone'],
  supportedWidthRange: ['m', 'xl'],

  editorPath(contentElement) {
    const selectedItemId = contentElement.transientState.get('selectedItemId');

    if (selectedItemId) {
      return `/scrolled/external_links/${contentElement.id}/${selectedItemId}`;
    }
  },

  configurationEditor({entry, contentElement}) {
    this.tab('general', function() {
      const layout = contentElement.section.configuration.get('layout');

      this.view(SidebarListView, {
        contentElement: this.model.parent,
        collection: ExternalLinkCollection.forContentElement(this.model.parent, entry)
      });

      this.input('textPosition', SelectInputView, {
        values: features.isEnabled('external_links_options') ?
                ['below', 'right', 'overlay', 'none'] :
                ['below', 'none']
      });
      this.group('ContentElementVariant', {entry});
      this.input('overlayOpacity', SliderInputView, {
        defaultValue: 70,
        visibleBinding: 'textPosition',
        visibleBindingValue: 'overlay'
      });
      this.view(SeparatorView);
      this.group('ContentElementPosition');
      this.view(SeparatorView);
      this.input('linkWidth', SliderInputView, {
        displayText: value => [
          'XS', 'S', 'M', 'L', 'XL', 'XXL'
        ][value + 2],
        saveOnSlide: true,
        minValue: -2,
        maxValueBinding: ['width', 'textPosition'],
        maxValue: ([width, textPosition]) => maxLinkWidth({width, layout, textPosition}),
        defaultValue: -1
      });
      this.input('linkAlignment', SelectInputView, {
        values: ['spaceEvenly', 'left', 'right', 'center'],
        visibleBinding: 'textPosition',
        visible: textPosition => textPosition !== 'right'
      });
      this.input('thumbnailSize', SelectInputView, {
        values: ['small', 'medium', 'large'],
        visibleBinding: 'textPosition',
        visibleBindingValue: 'right'
      });
      this.input('thumbnailAspectRatio', SelectInputView, {
        values: ['wide', 'narrow', 'square', 'portrait', 'original']
      });
      this.input('textSize', SelectInputView, {
        values: ['small', 'medium', 'large']
      });
    });
  }
});

// register file handler for thumbnail of external link
editor.registerFileSelectionHandler('contentElement.externalLinks.link', function (options) {
  const contentElement = options.entry.contentElements.get(options.contentElementId);
  const links = ExternalLinkCollection.forContentElement(contentElement, options.entry)

  this.call = function(file) {
    const link = links.get(options.id);
    link.setReference('thumbnail', file);
  };

  this.getReferer = function() {
    return '/scrolled/external_links/' + contentElement.id + '/' + options.id;
  };
});
