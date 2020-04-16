import Marionette from 'backbone.marionette';

export const SideBarRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'page_links/:id': 'pageLink',
    'pages/:id': 'page',
    'pages/:id/:tab': 'page',
    'chapters/:id': 'chapter',
    'storylines/:id': 'storyline',
  }
});
