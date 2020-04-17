import Marionette from 'backbone.marionette';

export const SidebarRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'widgets/:id': 'widget',

    'files/:collectionName?handler=:handler&payload=:payload&filter=:filter': 'files',
    'files/:collectionName?handler=:handler&payload=:payload': 'files',
    'files/:collectionName': 'files',
    'files': 'files',

    'confirmable_files?type=:type&id=:id': 'confirmableFiles',
    'confirmable_files': 'confirmableFiles',

    'meta_data': 'metaData',
    'meta_data/:tab': 'metaData',
    'publish': 'publish',

    '?storyline=:id': 'index',
    '.*': 'index'
  }
});
