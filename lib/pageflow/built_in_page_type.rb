module Pageflow
  # Definition of page type located inside the Pageflow gem.
  class BuiltInPageType < PageType
    attr_reader :name

    def initialize(name)
      @name = name.to_s
    end

    def template_path
      File.join('pageflow', 'pages', 'templates', "_#{name}.html.erb")
    end

    def translation_key
      "activerecord.values.page.template.#{name}"
    end

    # Factory methods to decouple Pageflow initializers from concrete
    # page type classes, so we might decide later to create a
    # VideoPageType subclass etc.

    def self.audio
      new('audio')
    end

    def self.background_image
      new('background_image')
    end

    def self.background_video
      new('background_video')
    end

    def self.internal_links
      new('internal_links')
    end

    def self.video
      new('video')
    end
  end
end
