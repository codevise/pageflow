import {editor} from 'pageflow-scrolled/editor';
import {features} from 'pageflow/frontend';
import {SelectInputView, SliderInputView, SeparatorView, CheckBoxInputView} from 'pageflow/ui';

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

  defaultConfig: {
    thumbnailAspectRatio: 'square'
  },

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
        values: ['below', 'right', 'overlay', 'none']
      });
      this.group('ContentElementVariant', {entry});
      this.input('overlayOpacity', SliderInputView, {
        defaultValue: 70,
        visibleBinding: 'textPosition',
        visibleBindingValue: 'overlay'
      });
      this.view(SeparatorView);
      this.group('ContentElementPosition', {entry});
      this.view(SeparatorView);

      if (features.isEnabled('teaser_list_scroller')) {
        this.input('enableScroller', SelectInputView, {
          values: ['never', 'always']
        });
      }

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
        visibleBinding: ['textPosition', 'enableScroller'],
        visible: ([textPosition, enableScroller]) =>
          textPosition !== 'right' && enableScroller !== 'always',
      });
      this.input('linkAlignment', SelectInputView, {
        values: ['left'],
        disabled: true,
        visibleBinding: ['textPosition', 'enableScroller'],
        visible: ([textPosition, enableScroller]) =>
          textPosition !== 'right' && enableScroller === 'always',
      });
      this.input('thumbnailSize', SelectInputView, {
        values: ['small', 'medium', 'large'],
        visibleBinding: 'textPosition',
        visibleBindingValue: 'right'
      });

      const [aspectRatios, aspectRatiosTexts] = entry.getAspectRatios({includeOriginal: true});

      this.input('thumbnailAspectRatio', SelectInputView, {
        values: aspectRatios,
        texts: aspectRatiosTexts
      });
      this.input('thumbnailFit', SelectInputView, {
        values: ['cover', 'contain']
      });
      this.input('textSize', SelectInputView, {
        values: ['small', 'medium', 'large']
      });
      this.input('textAlign', SelectInputView, {
        values: ['left', 'right', 'center']
      });
      this.input('displayButtons', CheckBoxInputView);
      this.group('ContentElementInlineFileRightsSettings');
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
