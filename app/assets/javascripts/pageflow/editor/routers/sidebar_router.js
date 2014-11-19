pageflow.SidebarRouter = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    'pages/:id': 'page',
    'pages/:id/:tab': 'page',
    'chapters/:id': 'chapter',

    'files/:collectionName?handler=:handler&payload=:payload': 'files',
    'files/:collectionName': 'files',
    'files': 'files',

    'confirmable_files?type=:type&id=:id': 'confirmableFiles',
    'confirmable_files': 'confirmableFiles',

    'meta_data': 'metaData',
    'meta_data/:tab': 'metaData',
    'publish': 'publish',

    '.*': 'index'
  }
});
