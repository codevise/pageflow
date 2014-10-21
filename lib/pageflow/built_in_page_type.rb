module Pageflow
  # Definition of page type located inside the Pageflow gem.
  class BuiltInPageType < PageType
    attr_reader :name, :file_type_models

    def initialize(name, options = {})
      @name = name.to_s
      @file_type_models = options.fetch(:file_type_models, [])
    end

    def file_types
      @file_types ||= file_type_models.map do |model_name|
        model = model_name.constantize
        base_name = model_name.underscore.split('/').last

        FileType.new(model: model,
                     editor_partial: "pageflow/editor/#{base_name.pluralize}/#{base_name}",
                     collection_name: base_name.pluralize)
      end
    end

    def template_path
      File.join('pageflow', 'pages', 'templates', "_#{name}.html.erb")
    end

    def translation_key
      "activerecord.values.pageflow/page.template.#{name}"
    end

    # Factory methods to decouple Pageflow initializers from concrete
    # page type classes, so we might decide later to create a
    # VideoPageType subclass etc.

    def self.audio
      new('audio', file_type_models: ['Pageflow::ImageFile', 'Pageflow::AudioFile'])
    end

    def self.audio_loop
      new('audio_loop', file_type_models: ['Pageflow::ImageFile', 'Pageflow::AudioFile'])
    end

    def self.background_image
      new('background_image', file_type_models: ['Pageflow::ImageFile'])
    end

    def self.background_video
      new('background_video', file_type_models: ['Pageflow::ImageFile', 'Pageflow::VideoFile'])
    end

    def self.internal_links
      new('internal_links', file_type_models: ['Pageflow::ImageFile'])
    end

    def self.video
      new('video', file_type_models: ['Pageflow::ImageFile', 'Pageflow::VideoFile'])
    end
  end
end
