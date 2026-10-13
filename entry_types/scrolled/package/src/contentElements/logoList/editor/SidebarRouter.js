import Marionette from 'backbone.marionette';

export const SidebarRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'scrolled/logoLists/:id/:item_id': 'item'
  }
});
