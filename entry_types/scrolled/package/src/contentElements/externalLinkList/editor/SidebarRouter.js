import Marionette from 'backbone.marionette';

export const SidebarRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'scrolled/external_links/:id/:link_id': 'link'
  }
});
