import Marionette from 'backbone.marionette';

export const SidebarRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'scrolled/hotspots/:id/:area_id': 'area',
    'scrolled/hotspots/:id/:area_id/:tab': 'area',
  }
});
