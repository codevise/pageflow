module Pageflow
  class BuiltInPageTypesPlugin < Plugin
    def configure(config)
      config.page_types.register(plain_page_type)
      config.page_types.register(video_page_type)
      config.page_types.register(audio_page_type)
    end

    private

    def plain_page_type
      Pageflow::React.create_page_type('background_image',
                                       thumbnail_candidates: default_thumbnail_candidates,
                                       file_types: [
                                         BuiltInFileType.image,
                                         BuiltInFileType.video
                                       ])
    end

    def video_page_type
      Pageflow::React.create_page_type('video',
                                       thumbnail_candidates: video_thumbnail_candidates,
                                       file_types: [
                                         BuiltInFileType.image,
                                         BuiltInFileType.video
                                       ])
    end

    def audio_page_type
      Pageflow::React.create_page_type('audio',
                                       thumbnail_candidates: default_thumbnail_candidates,
                                       file_types: [
                                         BuiltInFileType.audio,
                                         BuiltInFileType.image,
                                         BuiltInFileType.video
                                       ])
    end

    def video_thumbnail_candidates
      [
        {file_collection: 'image_files', attribute: 'thumbnail_image_id'},
        {file_collection: 'image_files', attribute: 'poster_image_id'},
        {file_collection: 'video_files', attribute: 'video_file_id'}
      ]
    end

    def default_thumbnail_candidates
      [
        {
          file_collection: 'image_files',
          attribute: 'thumbnail_image_id'
        },
        {
          file_collection: 'image_files',
          attribute: 'background_image_id',
          unless: {
            attribute: 'background_type',
            value: 'video'
          }
        },
        {
          file_collection: 'image_files',
          attribute: 'poster_image_id',
          if: {
            attribute: 'background_type',
            value: 'video'
          }
        },
        {
          file_collection: 'video_files',
          attribute: 'video_file_id',
          if: {
            attribute: 'background_type',
            value: 'video'
          }
        }
      ]
    end
  end
end
