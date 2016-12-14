module Pageflow
  # Definition of page type located inside the Pageflow gem.
  class BuiltInPageType < PageType
    attr_reader :name, :file_types

    def initialize(name, options = {})
      @name = name.to_s
      @file_types = options.fetch(:file_types, [])
      @thumbnail_candidates = options.fetch(:thumbnail_candidates, nil)
    end

    def template_path
      File.join('pageflow', 'pages', 'templates', "_#{name}.html.erb")
    end

    def translation_key
      "activerecord.values.pageflow/page.template.#{name}"
    end

    def help_entry_translation_key
      "pageflow.help_entries.built_in_page_type.#{name}"
    end

    def translation_key_prefix
      "pageflow.built_in_page_type.#{name}"
    end

    def thumbnail_candidates
      @thumbnail_candidates.presence || super
    end

    # Factory methods to decouple Pageflow initializers from concrete
    # page type classes, so we might decide later to create a
    # VideoPageType subclass etc.

    def self.audio
      new('audio', file_types: [BuiltInFileType.image, BuiltInFileType.audio])
    end

    def self.audio_loop
      new('audio_loop', file_type_models: ['Pageflow::ImageFile', 'Pageflow::AudioFile'])
    end

    def self.background_image
      new('background_image', file_types: [BuiltInFileType.image])
    end

    def self.background_video
      new('background_video',
          file_types: [BuiltInFileType.image, BuiltInFileType.video],
          thumbnail_candidates: video_thumbnail_candidates)
    end

    def self.video
      new('video',
          file_types: [BuiltInFileType.image, BuiltInFileType.video],
          thumbnail_candidates: video_thumbnail_candidates)
    end

    def self.video_thumbnail_candidates
      [
        {file_collection: 'image_files', attribute: 'thumbnail_image_id'},
        {file_collection: 'image_files', attribute: 'poster_image_id'},
        {file_collection: 'video_files', attribute: 'video_file_id'}
      ]
    end
  end
end
