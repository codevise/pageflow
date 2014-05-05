pageflow.SidebarRouter = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    'pages/:id': 'page',
    'pages/:id/:tab': 'page',
    'chapters/:id': 'chapter',

    'files/image_files?page=:page_id&attribute=:attribute': 'imageFiles',
    'files/video_files?page=:page_id&attribute=:attribute': 'videoFiles',
    'files/audio_files?page=:page_id&attribute=:attribute': 'audioFiles',

    'files/image_files': 'imageFiles',
    'files/video_files': 'videoFiles',
    'files/audio_files': 'audioFiles',

    'files?page=:page_id&attribute=:attribute': 'files',
    'files': 'files',

    'meta_data': 'metaData',
    'publish': 'publish',

    '.*': 'index'
  }
});