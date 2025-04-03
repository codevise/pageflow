import Marionette from 'backbone.marionette';

export const SidebarRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'scrolled/imageGalleries/:id/:item_id': 'item'
  }
});
