import {editor} from 'pageflow-scrolled/editor';

import {SidebarRouter} from './SidebarRouter';
import {SidebarController} from './SidebarController';
import {SidebarListView} from './SidebarListView';
import {ExternalLinkCollection} from './models/ExternalLinkCollection';

//register sidebar router to handle multiple sidebar views of this content element
//router defines the URL hash path mapping and controller provides functions for the paths
editor.registerSideBarRouting({
  router: SidebarRouter,
  controller: SidebarController
});

// register external link list content element configuration editor for sidebar
editor.contentElementTypes.register('externalLinkList', {
  configurationEditor({entry}) {
    this.tab('general', function() {
      this.view(SidebarListView, {
        contentElement: this.model.parent,
        collection: ExternalLinkCollection.forContentElement(this.model.parent, entry)
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
