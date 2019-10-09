module Pageflow
  # @api private
  module BuiltInPageType
    def self.plain
      Pageflow::React.create_page_type('background_image',
                                       thumbnail_candidates: default_thumbnail_candidates,
                                       export_version: Pageflow::VERSION,
                                       file_types: [
                                         BuiltInFileType.image,
                                         BuiltInFileType.video
                                       ])
    end

    def self.video
      Pageflow::React.create_page_type('video',
                                       thumbnail_candidates: video_thumbnail_candidates,
                                       export_version: Pageflow::VERSION,
                                       file_types: [
                                         BuiltInFileType.image,
                                         BuiltInFileType.video
                                       ])
    end

    def self.audio
      Pageflow::React.create_page_type('audio',
                                       thumbnail_candidates: default_thumbnail_candidates,
                                       export_version: Pageflow::VERSION,
                                       file_types: [
                                         BuiltInFileType.audio,
                                         BuiltInFileType.image,
                                         BuiltInFileType.video
                                       ])
    end

    def self.video_thumbnail_candidates
      [
        {file_collection: 'image_files', attribute: 'thumbnail_image_id'},
        {file_collection: 'image_files', attribute: 'poster_image_id'},
        {file_collection: 'video_files', attribute: 'video_file_id'}
      ]
    end

    def self.default_thumbnail_candidates
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
