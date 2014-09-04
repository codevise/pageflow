pageflow.SidebarRouter = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    'pages/:id': 'page',
    'pages/:id/:tab': 'page',
    'chapters/:id': 'chapter',

    'files/image_files?handler=:handler&payload=:payload': 'imageFiles',
    'files/video_files?handler=:handler&payload=:payload': 'videoFiles',
    'files/audio_files?handler=:handler&payload=:payload': 'audioFiles',

    'files/image_files': 'imageFiles',
    'files/video_files': 'videoFiles',
    'files/audio_files': 'audioFiles',

    'files?page=:page_id&attribute=:attribute': 'files',
    'files': 'files',

    'confirmable_files?type=:type&id=:id': 'confirmableFiles',
    'confirmable_files': 'confirmableFiles',

    'meta_data': 'metaData',
    'publish': 'publish',

    '.*': 'index'
  }
});
