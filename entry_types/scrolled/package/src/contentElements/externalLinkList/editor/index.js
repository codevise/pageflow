import {editor} from 'pageflow-scrolled/editor';

import {SidebarRouter} from './SidebarRouter';
import {SidebarController} from './SidebarController';

//register sidebar router to handle multiple sidebar views of this content element
//router defines the URL hash path mapping and controller provides functions for the paths
editor.registerSideBarRouting({
  router: SidebarRouter,
  controller: SidebarController
});

// register external link list content element configuration editor for sidebar
editor.contentElementTypes.register('externalLinkList', {
  configurationEditor() {
    this.tab('general', function() {
      var externalListModel = this.model.parent;
      //redirect to special hash path that is specific to external links only
      editor.navigate(`/scrolled/external_links/${externalListModel.get('id')}/`, {trigger: true});
    });
  }
});

// register file handler for thumbnail of external link
editor.registerFileSelectionHandler('contentElement.externalLinks.link', function (options) {
  const contentElement = options.entry.contentElements.get(options.contentElementId);
  const links = contentElement.configuration.get('links');
  
  this.call = function(file) {
    const link = links.find(link => link.id == options.id);
    link.thumbnail = file.get('perma_id');
    contentElement.configuration.set('links', links);
    contentElement.configuration.trigger('change', contentElement.configuration);
  };

  this.getReferer = function() {
    return '/scrolled/external_links/' + contentElement.id + '/' + options.id;
  };
});
